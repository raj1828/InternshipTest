document.addEventListener('DOMContentLoaded', async () => {
       try {
              const response = await fetch('http://localhost:5000/api/tickers');
              const data = await response.json();

              // Populate the table with fetched data
              const tableBody = document.querySelector('tbody');
              tableBody.innerHTML = ''; // Clear existing rows

              data.forEach((ticker, index) => {
                     const difference = ((ticker.last - ticker.buy) / ticker.last * 100).toFixed(2); // Calculate difference
                     const savings = (ticker.high - ticker.low).toFixed(2); // Calculate savings

                     const row = `
                   <tr>
                       <td>${index + 1}</td>
                       <td>${ticker.name.toUpperCase()}</td>
                       <td>₹ ${ticker.last}</td>
                       <td>₹ ${ticker.buy} / ₹ ${ticker.sell}</td>
                       <td class="${difference >= 0 ? 'positive' : 'negative'}">${difference}%</td>
                       <td>₹ ${savings}</td>
                   </tr>
               `;
                     tableBody.innerHTML += row;
              });

       } catch (error) {
              console.error('Error fetching tickers:', error);
       }
});
