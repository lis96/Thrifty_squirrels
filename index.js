let field = new Field();
new Mink([0, 0], field);
new Mink([0, 2], field);
new Mink([2, 1], field);
new Mink([3, 0], field);
new Squirrel([0, 1], field, 'line2height', [0, 0]);
new Squirrel([1, 2], field, 'line2width', [0, 0]);
new Squirrel([1, 0], field, 'topRightCorner', [1, 0]);
new Squirrel([2, 2], field, 'topLeftCorner', [1, 0]);
Logger.log(field.toString());

field = new FieldGUI(field, $('.wrapper'));