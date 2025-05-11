const { expect } = require('chai');
const path = require('path');
const sinon = require('sinon');

const { Scheduler } = require('../../src/task-scheduler/scheduler.js');

describe('Scheduler', function() {
    this.timeout(10_000);

    let scheduler;

    before(() => {
        sinon.stub(process, 'exit');
    });

    after(() => {
        process.exit.restore();
    });

    beforeEach(() => {
        scheduler = new Scheduler(
            2,
            path.resolve(__dirname, './methods.js')
        );
        scheduler.start();
    });

    afterEach(async () => {
        await scheduler.workerPool.terminate();
    });

    it('should compute add correctly', async () => {
        const result = await scheduler.runTask('add', { a: 10, b: 15 });
        expect(result).to.equal(25);
    });

    it('should compute multiply correctly', async () => {
        const result = await scheduler.runTask('multiply', { a: 6, b: 7 });
        expect(result).to.equal(42);
    });

    it('should reject unknown task types', async () => {
        try {
            await scheduler.runTask('nonexistent', { foo: 'bar' });
            throw new Error('Expected runTask to throw for unknown type');
        } catch (err) {
            expect(err).to.be.an('Error');
            expect(err.message).to.match(/Task nonexistent failed: Unknown task type/);
        }
    });
});
