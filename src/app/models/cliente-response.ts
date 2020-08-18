import { Cliente } from './cliente';
export class ClienteResponse {
    isSuccess: boolean;
    isWarning: boolean;
    message: string;
    data: Cliente;
}
