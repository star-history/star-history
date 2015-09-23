import getStarHistory from '../getStarHistory';

// getStarHistory('timqian/jsCodeStructure');
(async function() {
  const history = await getStarHistory('jquery/jquery')
    .catch(err => {
      console.log(err);
    });
  console.log( history );
})();
