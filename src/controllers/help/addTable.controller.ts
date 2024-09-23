import 'express-async-errors';

import { Help } from '../../models/helpAndTables.model';
import { AddTablesHandler } from '../../types/endpoints/helpAndTables.endpoints';

export const addTableHandler: AddTablesHandler = async (req, res) => {
  await Help.deleteMany({});

  for (let i = 0; i < req.body.numberOfTable; i++) {
    const newHelp = new Help({
      tableNum: i + 1,
    });

    await newHelp.save();
  }

  res.status(201).json({ message: 'success' });
};
