import { findJobsiteRecord } from '../src/repositories/workBlockRepository.js';

(async () => {
  const result = await findJobsiteRecord('random');
  console.log(result);
})();