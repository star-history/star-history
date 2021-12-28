import generateUrls from '../generateUrls';

// describe('getData()', () => {
// it('should return an arg parser', () => {
(async function() {
  console.log('bluebird:');
  const bluebirdArray = await generateUrls('petkaantonov/bluebird')
    .catch(err => {
      console.log(err);
    });
  console.log(bluebirdArray);

  console.log('jsCodeStructure:');
  const jsCodeStructureArray = await generateUrls('timqian/jsCodeStructure')
    .catch(err => {
      console.log(err);
    });
  console.log(jsCodeStructureArray);

  console.log('timqian/tcp_test:');
  const tcp_testArray = await generateUrls('timqian/tcp_test')
    .catch(err => {
      console.log(err);
    });
  console.log(tcp_testArray);
})();

//   });
// });
