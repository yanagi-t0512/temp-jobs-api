const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs, count: jobs.length})
  // res.send('get all jobs');
};


const getJob = async (req, res) => {
  const {user:{userId}, params:{id:jobId}} = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  })
  if(!job){
    throw new NotFoundError(`ジョブはありませんでした`)
  }
  res.status(StatusCodes.OK).json({job})
  // res.send('get job');
};


const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
  // res.json(req.body);
  // res.send('create job')
};


const updateJob = async (req, res) => {
  const {
    body:{company, position}, user:{userId}, params:{id:jobId}
  } = req

  if(company === '' || position === ''){
    throw new BadRequestError('会社名 or ポジションの入力は必要です')
  }

  const job = await Job.findByIdAndUpdate({
    _id: jobId,
    createdBy: userId,
  }, req.body, {new:true, runValidators:true})
  if(!job){
    throw new NotFoundError(`ジョブはありませんでした`)
  }
  res.status(StatusCodes.OK).json({job})

  // res.send('update job');
};


const deleteJob = async (req, res) => {
  const {user:{userId}, params:{id:jobId}} = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId
  })
  if(!job){
    throw new NotFoundError(`ジョブはありませんでした`)
  }
  res.status(StatusCodes.OK).send('削除しました')
  // res.send('delete job');
};


module.exports = {
  getAllJobs, getJob, createJob, updateJob, deleteJob
};
