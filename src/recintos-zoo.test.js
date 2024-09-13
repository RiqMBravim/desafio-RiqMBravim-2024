import { RecintosZoo } from "./recintos-zoo.js";

describe('Recintos do Zoologico', () => {
    let zoo;

    beforeEach(() => {
        zoo = new RecintosZoo();
    });

    test('Deve rejeitar animal inválido', () => {
            const resultado = zoo.analisaRecintos('UNICORNIO', 1);
            expect(resultado.erro).toBe("Animal inválido");
            expect(resultado.recintosViaveis).toBeFalsy();
        });

    test('Deve rejeitar quantidade inválida', () => {
            const resultado = zoo.analisaRecintos('MACACO', 0);
            expect(resultado.erro).toBe("Quantidade inválida");
            expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
            const resultado = zoo.analisaRecintos('MACACO', 10);
            expect(resultado.erro).toBe("Não há recinto viável");
            expect(resultado.recintosViaveis).toBeFalsy();
        });

    test('Deve encontrar recinto para 1 crocodilo', () => {
        const resultado = zoo.analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 5 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(1);
    });

    test('Deve encontrar recintos para 2 macacos', () => {

        const resultado = zoo.analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 2 total: 7)');
        expect(resultado.recintosViaveis[3]).toBe('Recinto 6 (espaço livre: 6 total: 10)');
        expect(resultado.recintosViaveis.length).toBe(4);
    });

    test('Não deve permitir alocar 1 macaco em um recinto vazio', () => {

        const resultado = zoo.analisaRecintos('MACACO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 6 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 3 (espaço livre: 3 total: 7)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 6 (espaço livre: 7 total: 10)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Não deve permitir alocar hipopotamo junto a outros herbivoros caso o bioma não seja savana e rio', () => {

        const resultado = zoo.analisaRecintos('HIPOPOTAMO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 3 (espaço livre: 0 total: 7)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 4 (espaço livre: 4 total: 8)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 7 (espaço livre: 0 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    test('Leopardos não podem ser colocados em nenhum bioma disponivel', () => {

        const resultado = zoo.analisaRecintos('LEOPARDO', 1);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

});

