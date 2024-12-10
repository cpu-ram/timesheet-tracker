import { addJobsite, findJobsites, getDefaultJobsiteProperties, getJobsite } from '../services/jobsiteService.js'

export const findJobsitesHandler = async (req, res) => {
  const result = await findJobsites(req.query.query);
  res.json(result);
}

export const getJobsiteHandler = async (req, res) => {
  const result = await getJobsite(req.params.id);
  res.json(result)
}

export const addJobsiteHandler = async (req, res) => {
  const result = await addJobsite(
    req.body.id,
    req.body.type,
    req.body.address,
    req.body.name,
    req.body.supervisorId,
    req.body.defaultWorkStartTime,
    req.body.defaultWorkEndTime,
    req.body.defaultBreakStartTime,
    req.body.defaultBreakEndTime,
  );
  res.json(result);
}