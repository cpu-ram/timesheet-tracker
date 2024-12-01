import { addJobsite, findJobsites, getDefaultJobsiteProperties, } from '../services/jobsiteService.js'

export const getJobsites = async (req, res) => {
  const result = await findJobsites(req.params.query);
  res.json(result);
}