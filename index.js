let field = new Field();
new Squirrel([0, 1], field, 'line2height');
new Squirrel([1, 2], field, 'line2width');
const sq = new Squirrel([2, 2], field, 'topRightCorner');
Logger.log(field.toString());
sq.left();
sq.left();
sq.left();
sq.bottom();
sq.top();
new Squirrel([2, 2], field, 'bottomLeftCorner');
Logger.log(field.toString());

field = new FieldGUI(field, $('.wrapper'));