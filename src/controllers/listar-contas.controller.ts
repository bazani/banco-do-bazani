import { Request, Response } from 'express';
import Controller from '../utils/decorators/controller.decorator';
import { Get } from '../utils/decorators/handlers.decorator';

export interface IContas {
  id: string;
  agencia: string;
  contaCorrente: string;
}


@Controller('/listar-contas')
export default class ListarContasController {
  private contas: Array<IContas> = [
    {id: '89f9448e', agencia: '1234', contaCorrente: '12345-6'},
    {id: 'b7a84e00', agencia: '1225', contaCorrente: '28103-8'},
    {id: 'e8e49a7b', agencia: '1337', contaCorrente: '65432-1'},
  ];

  @Get('')
  public index(req: Request, res: Response): void {
    res.json({ contas: this.contas });
  }
}
