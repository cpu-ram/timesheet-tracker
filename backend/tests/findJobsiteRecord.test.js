import { findJobsiteRecord } from '../src/repositories/workBlockRepository.js';

(async () => {
  const result = await findJobsiteRecord('1');
  console.log(result);
})();