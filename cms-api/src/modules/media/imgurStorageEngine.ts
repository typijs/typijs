
import { Stream } from "stream";
import { Request } from "express";
import * as FormData from 'form-data';
import axios from 'axios';

import * as concat from "concat-stream";
import { StorageEngine } from "multer";


export interface MulterInFile extends Express.Multer.File {
    stream: Stream;
}

export interface MulterOutFile extends Express.Multer.File {
    id: string;
    title: string;
    description: string;
    type: string;
    deleteHash: string;
    name: string;
    link: string
}

export class MulterImgurStorageEngine implements StorageEngine {
    async _handleFile(req: Request, file: MulterInFile, cb: (error?: any, info?: Partial<MulterOutFile>) => void) {

        //collect all the data from a stream into a single buffer.
        file.stream.pipe(concat({ encoding: 'buffer' }, function (buffer) {
            const encoded = buffer.toString('base64')
            const data = new FormData();
            data.append('image', encoded);

            const config = {
                method: 'post',
                url: 'https://api.imgur.com/3/image',
                headers: {
                    'Authorization': 'Client-ID {{clientId}}',
                    ...data.getHeaders()
                },
                data: data
            };

            axios.create(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    /*
                        "data": {
                            "id": "orunSTu",
                            "title": null,
                            "description": null,
                            "datetime": 1495556889,
                            "type": "image/gif",
                            "animated": false,
                            "width": 1,
                            "height": 1,
                            "size": 42,
                            "views": 0,
                            "bandwidth": 0,
                            "vote": null,
                            "favorite": false,
                            "nsfw": null,
                            "section": null,
                            "account_url": null,
                            "account_id": 0,
                            "is_ad": false,
                            "in_most_viral": false,
                            "tags": [],
                            "ad_type": 0,
                            "ad_url": "",
                            "in_gallery": false,
                            "deletehash": "x70po4w7BVvSUzZ",
                            "name": "",
                            "link": "http://i.imgur.com/orunSTu.gif"
                        }
                    */
                    const { id, title, description, type, deletehash, name, } = response.data;
                    cb(null, { id, title, description, type, deleteHash: deletehash, name })
                })
                .catch(function (error) {
                    console.log(error);
                    cb(error);
                });

        }))
    }

    async _removeFile(req: Request, file: MulterOutFile, cb: (error: Error) => void) {
        //Remove file from imgur if existing
    }
}