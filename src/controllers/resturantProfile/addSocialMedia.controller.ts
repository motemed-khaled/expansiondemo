import 'express-async-errors';
import { Resturant } from '../../models/resturant.model';
import { AddSocialMediaHandler } from '../../types/endpoints/resturant.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { saveFiles } from '../../utils/file';

export const addSocialMediaHandler: AddSocialMediaHandler = async (req, res, next) => {
  const files = <{ icon?: [Express.Multer.File] }>req.files || [];
  const icon = files.icon ? files.icon[0] : undefined;

  const updatedRestaurant = await Resturant.findByIdAndUpdate(
    req.params.resturantId,
    {
      $push: {
        socialMediaLinks: {
          link: req.body.link,
          [icon ? 'icon' : (null as any)]: `/media/images/${icon?.filename}`,
        },
      },
    },
    { new: true },
  );

  if (!updatedRestaurant) return next(new BadRequestError('failed to add this social'));
  saveFiles('images', icon ? icon : undefined);
  res.status(200).json({ message: 'success', data: updatedRestaurant });
};
