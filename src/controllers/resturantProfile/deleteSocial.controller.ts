import 'express-async-errors';

import { Resturant } from '../../models/resturant.model';
import { DeleteSocialMediaHandler } from '../../types/endpoints/resturant.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { removeFiles } from '../../utils/file';

export const deleteSocialMediaHandler: DeleteSocialMediaHandler = async (req, res, next) => {
  const profile = await Resturant.findOneAndUpdate(
    { _id: req.params.resturantId },
    { $pull: { socialMediaLinks: { _id: req.params.socialId } } },
  );
  if (!profile) return next(new BadRequestError('failed to update this social'));
  const oldDocument = profile.socialMediaLinks.filter(
    (ele: any) => ele._id.toString() === req.params.socialId,
  );
  removeFiles(oldDocument[0]?.icon ? oldDocument[0].icon : undefined);
  res.status(204).json({ message: 'success' });
};
