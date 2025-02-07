function addQuantity(stock, articleId, quantityToAdd) {
    const article = stock.find(article => article.id === articleId);
    if (!article) {
        throw new Error('Article not found');
    }
    article.quantity += quantityToAdd;
}

function reduceQuantity(stock, articleId, quantityToReduce) {
    const article = stock.find(article => article.id === articleId);
    if (!article) {
        throw new Error('Article not found');
    }
    if (quantityToReduce > article.quantity) {
        throw new Error('Quantity requested is more than available');
    }
    article.quantity -= quantityToReduce;
}

function getStockReport(stock) {
    const report = [];
    for (let i = 0; i < stock.length; i++) {
        const article = stock[i];
        report.push({
            id: article.id,
            name: article.name,
            quantity: article.quantity,
            lowStock: article.quantity <= 10
        });
    }
    return report;
}

module.exports = { addQuantity, reduceQuantity, getStockReport };