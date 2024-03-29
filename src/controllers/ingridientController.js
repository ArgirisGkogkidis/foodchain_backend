const Ingridient = require('./../models/ingridient');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getIngridient = catchAsync(async (req, res, next) => {

    let query = Ingridient.find({ id: req.params.id });
    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data:
            [...doc]

    });
});

exports.getIngridientByID = catchAsync(async (req, res, next) => {

    let query = Ingridient.findById(req.params.id);
    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        doc
    });
});

// exports.getIngridient = factory.getOne(Ingridient);
exports.getAllIngridients = factory.getAll(Ingridient);
exports.updateIngredient = factory.updateOne(Ingridient);

exports.createIngridient = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const doc = await Ingridient.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});
