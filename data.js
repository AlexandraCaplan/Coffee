const userResponsesSection = document.querySelector('#user-responses');
const favoriteSelect = document.querySelector('#favorite');
const orderSelect = document.querySelector('#order');

const timHortonsVotesSpan = document.querySelector('#tim-hortons-votes');
const starbucksVotesSpan = document.querySelector('#starbucks-votes');
const dunkinDonutsSpan = document.querySelector('#dunkin-donuts-votes');

let userResponses = [];

const fetchUserResponses = async () => {
  const response = await fetch(
    'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTWTpBnVRdsfm0Sdmv2MWQlb3SI6UkEO-mSiXIhkXobo6fWfV_DJXdFPZ0oJAjmJpfEWg5V4ZL1tNFi/pub?output=csv'
  );
  const data = await response.text();
  const results = Papa.parse(data, { header: true });
  userResponses = results.data;
};

const fetchandShowResponses = async () => {
  await fetchUserResponses();
  const eachUserResponseHTML = userResponses.map(renderUserResponse);
  const allUserResponsesHTML = eachUserResponseHTML.join('');
  userResponsesSection.innerHTML = allUserResponsesHTML;
};

fetchandShowResponses();

const votes = {
  "Tim Horton's": 0,
  Starbucks: 0,
  'Coffee Bean and Tea Leaf': 0,
  Caribou: 0,
  'Dunkin Donuts': 0,
};

function renderUserResponse(userResponse) {
  const key = userResponse["What's your favorite of these coffee brands? "];

  votes[key] += 1;

  timHortonsVotesSpan.textContent = votes["Tim Horton's"];
  starbucksVotesSpan.textContent = votes.Starbucks;
  dunkinDonutsSpan.textContent = votes['Dunkin Donuts'];

  new Chart('pie-chart', {
    type: 'pie',
    data: {
      datasets: [
        {
          data: Object.values(votes),
          backgroundColor: ['blue', 'red', 'purple'],
        },
      ],
      labels: Object.keys(votes),
    },
  });

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
}

function responseFilter(userResponse) {
  const favorite =
    userResponse["What's your favorite of these coffee brands? "];
  const order = userResponse['How do you like to order your coffee?'];

  const selectedFavorite = favoriteSelect.value;
  const selectedOrder = orderSelect.value;

  return (
    (selectedFavorite === 'All' || favorite === selectedFavorite) &&
    (selectedOrder === 'All' || order === selectedOrder)
  );
}

function handleFilterInput() {
  const filteredResults = userResponse.filter(responseFilter);
  main.innerHTML = userResponse.map().join('');
}

favoriteSelect.addEventListener('input', handleFilterInput);
orderSelect.addEventListener('input', handleFilterInput);
