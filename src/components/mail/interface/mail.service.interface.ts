import { SendMailRequestDto } from '@components/mail/dto/request/send-mail.request.dto';
import { ACTIVE_ENUM } from '@constant/common';
import { ResponsePayload } from '@utils/response-payload';

export interface InformationInterface {
  id: Number;
  empCode: String;
  empName: String;
  orgName: String;
  purpose?: String;
  timeFrom: String;
  timeTo: String;
  placeFrom?: String;
  placeTo?: String;
  note?: String;
  status: String;
  totalTicket?: Number;
  ticketCodes?: String;
}
export interface MailServiceInterface {
}
