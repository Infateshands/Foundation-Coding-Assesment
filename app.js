$(document).ready(function () {
    $('#travelForm').on('submit', function (e) {
        e.preventDefault();

        let numPeople = $('#numPeople').val();
        let travelTime = $('#travelTime').val();
        let distance = $('#distance').val();

        let options = calculateTransportOptions(numPeople, travelTime, distance);
        displayTransportOptions(options);
    });

    function calculateTransportOptions(numPeople, travelTime, distance) {
        let options = [
            { type: 'Car', capacity: 5, fuelConsumption: 0.08 }, // 8 liters per 100 km
            { type: 'Van', capacity: 12, fuelConsumption: 0.12 }, // 12 liters per 100 km
            { type: 'Bus', capacity: 50, fuelConsumption: 0.3 } // 30 liters per 100 km
        ];

        return options.filter(option => option.capacity >= numPeople);
    }

    function displayTransportOptions(options) {
        let optionsDiv = $('#options');
        optionsDiv.empty();

        options.forEach(option => {
            let optionDiv = $(`
                <div class="option">
                    <h3>${option.type}</h3>
                    <p>Capacity: ${option.capacity} people</p>
                    <p>Fuel Consumption: ${option.fuelConsumption * 100} liters/100km</p>
                    <button class="calculateCost" data-type="${option.type}" data-fuel="${option.fuelConsumption}">Calculate Cost</button>
                </div>
            `);
            optionsDiv.append(optionDiv);
        });

        $('#transportOptions').show();

        $('.calculateCost').on('click', function () {
            let fuelConsumption = $(this).data('fuel');
            let distance = $('#distance').val();
            let cost = calculateCost(fuelConsumption, distance);
            displayCost(cost);
        });
    }

    function calculateCost(fuelConsumption, distance) {
        let fuelPricePerLiter = 1.5; // Assume $1.5 per liter
        let totalFuel = (fuelConsumption * distance) / 100;
        return totalFuel * fuelPricePerLiter;
    }

    function displayCost(cost) {
        $('#cost').text(`Estimated Cost: $${cost.toFixed(2)}`);
        $('#costDetails').show();
    }
});
