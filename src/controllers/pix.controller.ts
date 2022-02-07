import { Request, Response } from 'express';
import Controller from '../utils/decorators/controller.decorator';
import { Post } from '../utils/decorators/handlers.decorator';

export interface IPix {
  chave: string;
  valor: number;
}

@Controller('/pix')
export default class PixController {
    @Post('/:contaId/transferencia')
    public doTransferencia(req: Request, res: Response): void {
        // TODO: add logica, utilizando o controller da cc
    }

    @Post('/:contaId/cobranca')
    public doCobranca(req: Request, res: Response): void {
        // TODO: add logica, utilizando o controller da cc
    }
}

