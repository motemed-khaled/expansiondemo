import 'express-async-errors';
import { Resturant } from '../../models/resturant.model';
import { UpdateResturantHandler } from '../../types/endpoints/resturant.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { removeFiles, saveFiles } from '../../utils/file';

export const updateResturantHandler: UpdateResturantHandler = async (req, res, next) => {
  const files =
    <{ profileCover?: [Express.Multer.File]; imageProfile?: [Express.Multer.File] }>req.files || [];
  const profileCover = files.profileCover ? files.profileCover[0] : undefined;
  const imageProfile = files.imageProfile ? files.imageProfile[0] : undefined;

  const updatedResturant = await Resturant.findByIdAndUpdate(req.params.resturantId, {
    ...req.body,
    [profileCover ? 'profileCover' : (null as any)]: `/media/images/${profileCover?.filename}`,
    [imageProfile ? 'imageProfile' : (null as any)]: `/media/images/${imageProfile?.filename}`,
  });
  if (!updatedResturant) return next(new BadRequestError('cannot update this profile'));
  saveFiles(
    'images',
    profileCover ? profileCover : undefined,
    imageProfile ? imageProfile : undefined,
  );
  if (profileCover || imageProfile) {
    removeFiles(
      profileCover && updatedResturant.profileCover ? updatedResturant.profileCover : undefined,
      imageProfile && updatedResturant.imageProfile ? updatedResturant.imageProfile : undefined,
    );
  }
  const resturant = await Resturant.find();

  res.status(200).json({ message: 'success', data: resturant[0] });
};
