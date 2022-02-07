import { Request, Response } from 'express';
import Controller from '../utils/decorators/controller.decorator';
import { Get } from '../utils/decorators/handlers.decorator';

export interface ILancamento {
    id: number;
    descricao: string;
}

@Controller('/tipos-lancamentos')
export default class TiposLancamentosController {
    private tipos: ILancamento[] = [
        {id: 10, descricao: 'Tar Manut C/C'},
        {id: 13, descricao: 'Juros sobre limite'},
        {id: 15, descricao: 'IOF'},
        {id: 120, descricao: 'Transf via Pix'},
        {id: 15, descricao: 'Cobranca via Pix'},
        {id: 9, descricao: 'Tar uso limite'},
        {id: 11, descricao: 'Deposito em cheque'},
        {id: 8, descricao: 'Pagamento de titulo'},
        {id: 70, descricao: 'Deposito em especie'},
        {id: 231, descricao: 'Tar saque'},
        {id: 702, descricao: 'Anuidade cartao de credito'},
    ];

    @Get('')
    public index (req: Request, res: Response) {
        res.json(this.tipos);
    }
}

