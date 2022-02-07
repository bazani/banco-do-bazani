import connect, {sql} from '@databases/sqlite';

class Db {
    private db: any;

    constructor () {
        this.db = connect('banco_do_banco.db'); 
    }

    public async prepare() {
        await this.createDb();
        await this.populateDb();
    }

    private async createDb() {
        await this.db.query(sql`
            CREATE TABLE IF NOT EXISTS extrato(
                id INTEGER PRIMARY KEY,
                contaId TEXT,
                data TEXT,
                tipoLancto TEXT,
                codigoTipoOperacao INTEGER,
                descricao TEXT,
                valor REAL,
                saldo REAL
            );
        `);
    }

    private async populateDb() {
        const result = await this.db.query(sql`
            SELECT * FROM extrato LIMIT 1;
        `);

        if (!result.length) {
            await this.db.query(sql`INSERT INTO extrato VALUES(1, '89e', '2022-01-01', 'D', 10, '', 135.55, 293210.23)`);
        }
    }
}

export default new Db();

