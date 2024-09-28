import type { SongData } from "@lib/shared_types"
import mongoose from "mongoose";
import type { Types } from "mongoose";

interface SongDocument
  extends Omit<SongData, "id" | "list_id">,
    mongoose.Document {
  list_id: Types.ObjectId;
}

interface SongModel extends mongoose.Model<SongDocument> {}

const SongSchema = new mongoose.Schema<SongDocument>(
    {
        title: {
            type: String,
            required: true,
        },
        singer: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        list_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlayList",
            required: true,
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
              ret.id = ret._id.toString();
              ret.list_id = ret.list_id.toString();
              delete ret._id;
              delete ret.__v;
            },
          },
    }
);

const Song = mongoose.model<SongDocument, SongModel>("Song", SongSchema)
export default Song;