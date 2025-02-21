function addQuantity(stock, articleId, quantityToAdd, moveHistory) {
    if (typeof quantityToAdd !== 'number' || quantityToAdd <= 0) {
        throw new Error('Quantity must be a positive number');
    }
    const article = stock.find(article => article.id === articleId);
    if (!article) {
        throw new Error('Article not found');
    }
    article.quantity += quantityToAdd;
    notifyStockMove(article, quantityToAdd);

    addHistoryEntry(moveHistory, articleId, quantityToAdd);
}

function reduceQuantity(stock, articleId, quantityToReduce, moveHistory) {
    if (typeof quantityToReduce !== 'number' || quantityToReduce <= 0) {
        throw new Error('Quantity must be a positive number');
    }
    const article = stock.find(article => article.id === articleId);
    if (!article) {
        throw new Error('Article not found');
    }
    if (quantityToReduce > article.quantity) {
        throw new Error('Quantity requested is more than available');
    }
    const newQuantity = article.quantity - quantityToReduce;
    article.quantity = newQuantity;
    notifyStockMove(article, -quantityToReduce);

    addHistoryEntry(moveHistory, articleId, quantityToReduce);

    checkLowStock(article, newQuantity);
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

function checkLowStock(article, newQuantity) {
    const LOW_STOCK_THRESHOLD = 5;

    if (article.quantity <= LOW_STOCK_THRESHOLD) {
        console.warn(`Alert: The stock of article "${article.name}" (ID: ${article.id}) is now at ${newQuantity} units.`);
    }
}

function addHistoryEntry(moveHistory, articleId, move) {
    const previousHistoryLength = moveHistory.length;
    const entry = {
        id: moveHistory.length + 1,
        articleId,
        move,
        date: new Date(Math.floor(new Date().getTime() / 1000) * 1000)
    };
    moveHistory.push(entry);

    if (moveHistory.length > previousHistoryLength) {
        notifyNewHistoryEntry();
    }
}

function viewHistory(moveHistory) {
    moveHistory.forEach(entry => {
        const formattedDate = new Date(entry.date).toLocaleString('fr-FR');
        console.log(`ID: ${entry.id} | Article ID: ${entry.articleId} | Move: ${entry.move} units | Date: ${formattedDate}`);
    });
}

function notifyStockMove(article, move) {
    console.log(`Stock of "${article.name}" has been updated by ${move}`);
}

function notifyNewHistoryEntry() {
    console.log('New history entry added');
}

module.exports = { addQuantity, reduceQuantity, getStockReport, viewHistory };
