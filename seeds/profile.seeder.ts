import { config } from 'dotenv';
import mongoose from 'mongoose';

import { Catogry } from './../src/models/catogry.model';
import { Help } from './../src/models/helpAndTables.model';
import { Role } from './../src/models/role.model';
import { Type } from './../src/models/types.model';
import { Ifeatures } from './../src/types/features';
import { dbConnection } from '../src/config/database_connection';
import { Resturant } from '../src/models/resturant.model';
import { Slider } from '../src/models/slider.model';
import { User } from '../src/models/stuff.model';

const catogryId = '65ff30670d16ea01b7d57739';
const ids = [
  '65d718837be56fd48729de45',
  '65d718837be56fd48729de47',
  '65d718837be56fd48729de49',
  '65d718837be56fd48729de4b',
];


const roles = [
  {
    key: 'chief',
    permission: [Ifeatures.getAllOrderHandler, Ifeatures.updateOrderStatusHandler],
  },
  {
    key: 'cleaner',
    permission: [Ifeatures.updateTableStatus],
  },
  {
    key: 'waiter',
    permission: [
      Ifeatures.getAllOrderHandler,
      Ifeatures.updateOrderStatusHandler,
      Ifeatures.responseHelpHandler,
      Ifeatures.getHelpsHandler,
    ],
  },
  {
    key: 'cashier',
    permission: [
      Ifeatures.getAllOrderHandler,
      Ifeatures.updateIsPaidHandler,
      Ifeatures.updateOrderHandler,
      Ifeatures.getUsersHandler,
      Ifeatures.getHelpsHandler,
      Ifeatures.getUserHandler,
    ],
  },
];

config();

(async () => {
  await dbConnection();
  await mongoose.connection.dropDatabase();
  
  const resturant = await Resturant.find();
  const admin = await User.findOne({ type: 'admin' });
  if (resturant.length === 0) await Resturant.create({ name: 'resturant' });
  if (!admin)
    await User.create({
      email: 'admin@admin.com',
      password: '12345678',
      type: 'admin',
      name: 'admin',
      typeId: null,
    });

  const allRole = await Role.insertMany(roles);
  for (let i = 0; i < allRole.length; i++) {
    await Type.create({
      _id: ids[i],
      key: allRole[i].key,
      roleId: allRole[i].id,
    });
  }

  for (let i = 1; i < 100; i++) {
    await Help.create({ tableNum: i });
  }
  const slider = await Slider.find();
  if (slider.length === 0) await Slider.create({ images: [] });

  const cat = await Catogry.findById(catogryId);
  if (!cat) await Catogry.create({ _id: catogryId, name: 'اضافات' });
  console.log('setup done.....');
  await mongoose.connection.close();
})();
