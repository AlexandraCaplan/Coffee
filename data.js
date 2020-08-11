let responses = [];

const userResponsesSection = document.querySelector('#user-responses');
const favoriteSelect = document.querySelector('#favorite');
const orderSelect = document.querySelector('#order');

const fetchUserResponses = async () => {
  const response = await fetch(
    'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTWTpBnVRdsfm0Sdmv2MWQlb3SI6UkEO-mSiXIhkXobo6fWfV_DJXdFPZ0oJAjmJpfEWg5V4ZL1tNFi/pub?output=csv'
  );
  const data = await response.text();
  const results = Papa.parse(data, { header: true });
  responses = results.data;
};

const renderUserResponse = userResponse => {
  const name = userResponse["What's your name?"];
  const favoriteCoffee =
    userResponse["What's your favorite of these coffee brands? "];
  const whyLove = userResponse['Why do you love this brand?'];
  const orderCoffee = userResponse['How do you like to order your coffee?'];
  const coffeeHabits =
    userResponse['Have your coffee habits changed since covid?'];
  const digitalOffer =
    userResponse[
      'Please share a screenshot of an effective digital offer you received this week (can be any brand or food type)'
    ];
  console.log(digitalOffer);
  const googlePhotoID = digitalOffer.split('id=')[1];
  console.log(googlePhotoID);
  const defaultIMG = `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png`;
  const photoURL =
    `https://drive.google.com/thumbnail?id=${googlePhotoID}` || defaultIMG;

  return `
  <div class = "user-response">
  <h2>My name is: <br><em>${name}</em><h2>
  <h3>Of the major players in the US, my favorite US coffee chain is: <br><em> ${favoriteCoffee} </em> </h3>
  <h3>Why do I love this brand? <br> <em>${whyLove}</em></h3>
  <h4>I like to order my coffee:<br> <em>${orderCoffee}</em></h4>
  <h5> Since Covid 19, on a scale of 1-5 (5 the highest), how much have your coffee habits changed? <br> <em> ${coffeeHabits} </em></h5>
  <h5> Which digital offers have you received lately? <br> <img src = ${photoURL} alt = "Picture of digital offer"> </h5>
  </div>
  `;
};

const makeChart = () => {
  console.log('One chart, coming right up...', responses);
  const favoritesTally = {
    Starbucks: 0,
    "Tim Horton's": 0,
    'Dunkin Donuts': 0,
    Caribou: 0,
    'Coffee Bean and Tea Leaf': 0,
  };
  responses.forEach(response => {
    const oneUserFavoriteCoffee =
      response["What's your favorite of these coffee brands? "];
    favoritesTally[oneUserFavoriteCoffee] += 1;
  });
  /* eslint-disable no-new */
  new Chart('pie-chart', {
    type: 'pie',
    data: {
      datasets: [
        {
          data: Object.values(favoritesTally),
          backgroundColor: ['red', 'white'],
        },
      ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: Object.keys(favoritesTally),
    },
  });
};

const fetchandShowResponses = async () => {
  await fetchUserResponses();
  const eachUserResponseHTML = responses.map(renderUserResponse);
  const allUserResponsesHTML = eachUserResponseHTML.join('');
  userResponsesSection.innerHTML = allUserResponsesHTML;
  makeChart();
};

fetchandShowResponses();

function responseFilter(userResponse) {
  const favorite =
    userResponse["What's your favorite of these coffee brands? "];
  const order = userResponse['How do you like to order your coffee?'];

  const selectedFavorite = favoriteSelect.value;
  const selectedOrder = orderSelect.value;

  return (
    (selectedOrder === 'All' || order.includes(selectedOrder)) &&
    (selectedFavorite === 'All' || favorite.includes(selectedFavorite))
  );
}

function handleFilterInput() {
  const filteredResults = responses.filter(responseFilter);
  userResponsesSection.innerHTML = responses.map().join('');
}

favoriteSelect.addEventListener('input', handleFilterInput);
orderSelect.addEventListener('input', handleFilterInput);
