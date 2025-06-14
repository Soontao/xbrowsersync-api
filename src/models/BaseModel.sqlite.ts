// provide limited model functionalities like mongo but implemented by sqlite
import { randomUUID } from 'crypto';
import type { Database } from 'better-sqlite3';

const getDatabase = () => global.db as Database;

class SaveDocumentContext {
  private _id: string;
  private _type: string;
  private _doc: any;

  constructor(type, id, doc) {
    this._type = type;
    this._id = id;
    this._doc = doc;
  }

  async exec() {
    getDatabase()
      .prepare('INSERT INTO `Documents` (`id`, `type`, `content`) VALUES (?, ?, ?)')
      .run([this._id, this._type, JSON.stringify(this._doc)]);
    return this._doc;
  }
}

class FindDocumentContext {
  private _id: string;
  private _type: string;
  constructor(type, id) {
    this._type = type;
    this._id = id;
  }

  async exec() {
    const r = getDatabase()
      .prepare<[any, any], any>('SELECT * FROM `Documents` WHERE `id` = ? AND `type` = ? LIMIT 1')
      .get(this._id, this._type);
    if (!r?.content) {
      return null;
    }
    return JSON.parse(r.content, function (key, value) {
      if (
        typeof value === 'string' &&
        value.length === 24 &&
        value.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
      )
        return new Date(Date.parse(value));
      return value;
    });
  }
}

class FindOneAndUpdateDocumentContext {
  private _id: string;
  private _type: string;
  private _options: any;
  private _updateDoc: any;

  constructor(type, id, updateDoc, options = { new: false }) {
    this._type = type;
    this._id = id;
    this._options = options;
    this._updateDoc = updateDoc;
  }

  async exec() {
    const oldDoc = await new FindDocumentContext(this._type, this._id).exec();
    if (!oldDoc) {
      return null;
    }

    const newDoc = { ...oldDoc, ...this._updateDoc };

    getDatabase()
      .prepare('UPDATE `Documents` SET `content` = ? WHERE `id` = ? AND `type` = ?')
      .run([JSON.stringify(newDoc), this._id, this._type]);

    return this._options.new ? newDoc : oldDoc;
  }
}

class DeleteManyDocumentContext {
  private _type: string;
  private _filter?: any;

  constructor(type, filter?: any) {
    this._type = type;
    this._filter = filter;
  }

  async exec() {
    let where = '';
    let values = [];
    for (const [key, value] of Object.entries(this._filter)) {
      if (typeof value === 'object') {
        throw new Error('Filter cannot contain nested objects');
      }
      where += `AND json_extract(content,'$.${key}') = ? `;
      values.push(value);
    }
    return getDatabase()
      .prepare<any[], any>(`DELETE FROM Documents WHERE type = ? ${where}`)
      .run(this._type, ...values);
  }
}

class CountDocumentContext {
  private _type: string;

  private _filter?: any;

  constructor(type, filter?: any) {
    this._type = type;
    this._filter = filter;
  }

  async exec() {
    if (this._filter) {
      let where = '';
      let values = [];
      for (const [key, value] of Object.entries(this._filter)) {
        if (typeof value === 'object') {
          throw new Error('Filter cannot contain nested objects');
        }
        where += `AND json_extract(content,'$.${key}') = ? `;
        values.push(value);
      }
      return getDatabase()
        .prepare<any[], any>(`SELECT COUNT(1) AS COUNT FROM Documents WHERE type = ? ${where}`)
        .get(this._type, ...values)?.COUNT;
    }

    return getDatabase()
      .prepare<any[], any>('SELECT COUNT(1) AS COUNT FROM `Documents` WHERE `type` = ?')
      .get(this._type)?.COUNT;
  }
}

export class BaseModel<T extends { _id?: any }> {
  private _doc: Partial<T>;

  constructor(doc: Partial<T>) {
    if (!doc._id) {
      doc._id = randomUUID().replace(/-/g, '');
    }
    this._doc = doc;
  }

  static findOneAndUpdate({ _id }, updateDoc, options = { new: false }) {
    return new FindOneAndUpdateDocumentContext(this.name, _id, updateDoc, options);
  }

  static findById(id: string) {
    return new FindDocumentContext(this.name, id);
  }

  static estimatedDocumentCount() {
    return new CountDocumentContext(this.name);
  }

  static countDocuments(filter: any) {
    return new CountDocumentContext(this.name, filter);
  }

  static deleteMany(filter: any) {
    return new DeleteManyDocumentContext(this.name, filter);
  }

  async save() {
    return new SaveDocumentContext(this.constructor.name, this._doc._id, this._doc).exec();
  }
}
