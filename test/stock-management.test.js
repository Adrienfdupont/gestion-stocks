const { addQuantity, reduceQuantity, getStockReport } = require('../src/stock-management');

describe('Stock Management', () => {
    let stock;

    beforeEach(() => {
        stock = [
            { id: 1, name: 'Pomme verte', quantity: 20 },
            { id: 2, name: 'Clémentine', quantity: 5 },
            { id: 3, name: 'Grappe de raisin', quantity: 14 }
        ];
    });

    describe('Add an article to stock', () => {
        it('Should add quantity to an existing article', () => {
            addQuantity(stock, 1, 10);
            expect(stock.find(item => item.id === 1).quantity).toBe(30);
        });
    });

    describe('Reduce quantity of an article', () => {
        it('Should reduce quantity of an existing article', () => {
            reduceQuantity(stock, 1, 5);
            expect(stock.find(item => item.id === 1).quantity).toBe(15);
        });

        it('Should set stock to 0 without removing the article', () => {
            reduceQuantity(stock, 3, 14);
            expect(stock.find(item => item.id === 3).name).toBe('Grappe de raisin');
            expect(stock.find(item => item.id === 3).quantity).toBe(0);
        });

        it('Should alert if requested quantity is more than available quantity', () => {
            const result = reduceQuantity(stock, 2, 10);
            expect(result).toThrow('Quantity requested is more than available');
        });
    });

    describe('Get stock report', () => {
        it('Should return a report of all stock items with indication if quantity is 10 or less', () => {
            const report = getStockReport(stock);
            expect(report).toEqual([
                { id: 1, name: 'Pomme verte', quantity: 20, lowStock: false },
                { id: 2, name: 'Clémentine', quantity: 5, lowStock: true },
                { id: 3, name: 'Grappe de raisin', quantity: 14, lowStock: true }
            ]);
        });
    });
});