const { addQuantity, reduceQuantity, getStockReport, viewHistory } = require('../src/stock-management');

describe('Stock Management', () => {
    let stock;

    beforeEach(() => {
        stock = [
            { id: 1, name: 'Pomme verte', quantity: 20 },
            { id: 2, name: 'Clémentine', quantity: 5 },
            { id: 3, name: 'Grappe de raisin', quantity: 14 }
        ];

        moveHistory = [
            { id:1, articleId: 3, move: 2, date: new Date('2025-02-20T14:06:12') },
        ];
    });

    describe('Add an article to stock', () => {
        it('Should add quantity to an existing article', () => {
            addQuantity(stock, 1, 10, moveHistory);
            expect(stock.find(item => item.id === 1).quantity).toBe(30);
        });

        it('Should throw error if article unexsiting', () => {
            expect(() => addQuantity(stock, 4, 10)).toThrow('Article not found', moveHistory);
        });

        it('Should throw error if quantity is not a postive number', () => {
            expect(() => addQuantity(stock, 1, -8)).toThrow('Quantity must be a positive number', moveHistory);
        });
    });

    describe('Reduce quantity of an article', () => {
        it('Should reduce quantity of an existing article', () => {
            reduceQuantity(stock, 1, 5, moveHistory);
            expect(stock.find(item => item.id === 1).quantity).toBe(15);
        });

        it('Should set stock to 0 without removing the article', () => {
            reduceQuantity(stock, 3, 14, moveHistory);
            expect(stock.find(item => item.id === 3).name).toBe('Grappe de raisin');
            expect(stock.find(item => item.id === 3).quantity).toBe(0);
        });

        it('Should alert if requested quantity is more than available quantity', () => {
            expect(() => reduceQuantity(stock, 2, 10)).toThrow('Quantity requested is more than available');
        });

        it('Should throw error if article unexsiting', () => {
            expect(() => reduceQuantity(stock, 13, 8)).toThrow('Article not found');
        });

        it('Should throw error if quantity is not a postive number', () => {
            expect(() => addQuantity(stock, 2, -8)).toThrow('Quantity must be a positive number', moveHistory);
        });
    });

    describe('Stock move notification', () => {
        it('Should notify sotck move if quantity added with success', () => {
            console.log = jest.fn();
            addQuantity(stock, 1, 10, moveHistory);
            expect(console.log).toHaveBeenCalledWith('Stock of "Pomme verte" has been updated by 10');
        });

        it('Should not notify if quantity reduction failed', () => {
            console.log = jest.fn();
            try {
                reduceQuantity(stock, 2, 10);
            } catch (e) {
                expect(console.log).not.toHaveBeenCalled();
            }
        });
    });

    describe('Get stock report', () => {
        it('Should return a report of all stock items with indication if quantity is 10 or less', () => {
            const report = getStockReport(stock);
            expect(report).toEqual([
                { id: 1, name: 'Pomme verte', quantity: 20, lowStock: false },
                { id: 2, name: 'Clémentine', quantity: 5, lowStock: true },
                { id: 3, name: 'Grappe de raisin', quantity: 14, lowStock: false }
            ]);
        });
    });

    describe('Article move history', () => {
        it('Should add a history entry when adding quantity', () => {
            addQuantity(stock, 1, 10, moveHistory);
            expect(moveHistory).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        articleId: 1,
                        move: 10,
                        date: new Date(Math.floor(new Date().getTime() / 1000) * 1000)
                    })
                ])
            );
        });

        it('Should confirm that a new entry has been added', () => {
            console.log = jest.fn();
            addQuantity(stock, 1, 10, moveHistory);
            expect(console.log).toHaveBeenCalledWith('New history entry added');
        });

        it('Should not add a history entry when reducing quantity failed', () => {
            try {
                reduceQuantity(stock, 2, 10);
            } catch (e) {
                expect(moveHistory.length).toBe(1);
            }
        });

        it('Should show human readable history entries', () => {
            viewHistory(moveHistory);
            expect(console.log).toHaveBeenCalledWith(
                'ID: 1 | Article ID: 3 | Move: 2 units | Date: 20/02/2025 14:06:12'
            );
        });
    });

    describe('Low stock warning', () => {
        it('Should warn if stock is low', () => {
            console.warn = jest.fn();
            reduceQuantity(stock, 1, 17, moveHistory);
            expect(console.warn).toHaveBeenCalledWith('Alert: The stock of article "Pomme verte" (ID: 1) is now at 3 units.');
        });

        it('Should not warn if stock is not low', () => {
            console.warn = jest.fn();
            reduceQuantity(stock, 1, 5, moveHistory);
            expect(console.warn).not.toHaveBeenCalled();
        });
    });
});