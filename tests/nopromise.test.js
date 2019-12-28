const np = require('../src');
const sinon = require('sinon');

describe('nopromise basic functionalities', () => {
    it('chainCall', done=>{
        np.chainCall(
            [100,200,300,400,500,600],
            items => items.map(i=>i*2),
            items => items.map(i=>-i),
            items => items.reduce((txt, curr)=> txt+curr, '')
        ).then(ret=>{
            expect(ret).toBe('-200-400-600-800-1000-1200');
            done();
        }).catch(err=>{
            done(err);
        });
    });

    it('chainCallNp', ()=>{
        const ret = np.chainCallNp(
            [100,200,300,400,500,600],
            items => items.map(i=>i*2),
            items => items.map(i=>-i),
            items => items.reduce((txt, curr)=> txt+curr, '')
        );
        expect(ret).toBe('-200-400-600-800-1000-1200');
    });
    
});

describe('nopromise with callback functionalities', () => {
    
    it('chainCall', done=>{
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();

        np.chainCall(
            [100,200,300,400,500,600],
            np.hoc(items => items.map(i=>i*2), 1, callback1),
            items => items.map(i=>i+1),
            np.hoc(items => items.map(i=>-i)),
            np.hoc(items => items.reduce((txt, curr)=> txt+curr, ''), 2, callback2)
        ).then(ret=>{
            expect(ret).toBe('-201-401-601-801-1001-1201');
            expect(callback1.calledWith([200,400,600,800,1000,1200], 1)).toBe(true);
            expect(callback2.calledWith('-201-401-601-801-1001-1201', 2)).toBe(true)
            done();
        }).catch(err=>{
            done(err);
        });
    });

    it('chainCallNp', ()=>{
        const callback1 = sinon.spy();
        const callback2 = sinon.spy();
        
        const ret = np.chainCallNp(
            [100,200,300,400,500,600],
            np.hoc(items => items.map(i=>i*2), 1, callback1),
            np.hoc(items => items.map(i=>-i)),
            np.hoc(items => items.reduce((txt, curr)=> txt+curr, ''), 2, callback2)
        );
        expect(ret).toBe('-200-400-600-800-1000-1200');
        expect(callback1.calledWith([200,400,600,800,1000,1200], 1)).toBe(true);
        expect(callback2.calledWith('-200-400-600-800-1000-1200', 2)).toBe(true)
    });
    
});