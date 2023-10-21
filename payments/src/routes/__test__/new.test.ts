import request from 'supertest';
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@altick/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

// jest.mock('../../stripe');

it('should returns a 404 when purchasing an order the does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdasa',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('should returns a 401 when purchasing an order that doesnt belong to the order', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asdasa',
      orderId: order.id,
    })
    .expect(401);
});

it('should returns a 400 when purchasing a cancelled order', async () => {
  const userId: string = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'asdasa',
      orderId: order.id,
    })
    .expect(400);
});

it('should return a 201 with valid inputs', async () => {
  const userId: string = new mongoose.Types.ObjectId().toHexString();
  const price: number = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId,
    version: 0,
    price,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => charge.amount === price * 100);

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  //
  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(20 * 100);
  // expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({ orderId: order.id, stripeId: stripeCharge!.id });
  expect(payment).not.toBeNull();
});
