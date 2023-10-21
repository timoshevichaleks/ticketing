import { ExpirationCompleteEvent, Publisher, Subjects } from "@altick/common";
import { Stan } from "node-nats-streaming";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  public readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  public constructor(client: Stan) {
    super(client);
  }
}
