import { Resturant } from './../../models/resturant.model';
import 'express-async-errors';
import { UpdateSocialMediaHandler } from '../../types/endpoints/resturant.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { removeFiles, saveFiles } from '../../utils/file';

export const updateSocialMediaHandler: UpdateSocialMediaHandler = async (req, res, next) => {
  const files = <{ icon?: [Express.Multer.File] }>req.files || [];
  const icon = files.icon ? files.icon[0] : undefined;

  const updatedResturant = await Resturant.findOneAndUpdate(
    { _id: req.params.resturantId, 'socialMediaLinks._id': req.body.socialId },
    {
      $set: {
        'socialMediaLinks.$.link': req.body.link ? req.body.link : undefined,
        [icon ? 'socialMediaLinks.$.icon' : (null as any)]: `/media/images/${icon?.filename}`,
      },
    },
  );
  if (!updatedResturant) return next(new BadRequestError('failed to updated social'));
  const oldDocument = updatedResturant.socialMediaLinks.filter(
    (ele: any) => ele._id.toString() === req.body.socialId,
  );
  saveFiles('images', icon ? icon : undefined);
  console.log(oldDocument[0]?.icon);

  removeFiles(icon && oldDocument[0]?.icon ? oldDocument[0].icon : undefined);
  const restaurant = await updatedResturant.save();
  res.status(200).json({ message: 'success', data: restaurant });
};
