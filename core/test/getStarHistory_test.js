import getStarHistory from '../getStarHistory';

// getStarHistory('timqian/jsCodeStructure');
(async function() {
  const history = await getStarHistory('twbs/bootstrap')
    .catch(err => {
      console.log(err);
    });
  console.log( history );
})();
