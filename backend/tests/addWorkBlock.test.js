import { addWorkBlock } from '../src/services/workBlockService.js';

export default function testAddWorkBlock() {
  const employeeId = 1;
  addWorkBlock(employeeId, employeeId, new Date());
}

testAddWorkBlock();
