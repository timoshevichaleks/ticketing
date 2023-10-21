import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@altick/common";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});
ticketSchema.set('versionKey', 'version');

ticketSchema.pre('save', function (done) {
  this.$where = {
    version: this.get('version') - 1,
  };

  done();
})

ticketSchema.statics.build = ({ id, title, price }: TicketAttrs) => {
  return new Ticket({ _id: id, title, price });
}
ticketSchema.statics.findByEvent = ({ id, version }: { id: string, version: number }): Promise<TicketDoc | null> => {
  return Ticket.findOne({ _id: id, version: version - 1 });
}

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayments,
        OrderStatus.Complete,
      ],
    }
  });
  return !!existingOrder;
}

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket };
