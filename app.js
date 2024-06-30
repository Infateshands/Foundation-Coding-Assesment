$(document).ready(function () {
    $('#travelForm').on('submit', function (e) {
        e.preventDefault();

        let numPeople = parseInt($('#numPeople').val());
        let travelDays = parseInt($('#travelDays').val());
        let distance = parseInt($('#distance').val());

        let { options, message } = calculateTransportOptions(numPeople, travelDays, distance);
        displayTransportOptions(options, message);
    });

    function calculateTransportOptions(numPeople, travelDays, distance) {
        let options = [
            { type: 'Motorbike', minCapacity: 1, maxCapacity: 1, fuelConsumption: 0.037, hireCostPerDay: 109, minDays: 1, maxDays: 5 },
            { type: 'Small Car', minCapacity: 1, maxCapacity: 2, fuelConsumption: 0.085, hireCostPerDay: 129, minDays: 1, maxDays: 10 },
            { type: 'Large Car', minCapacity: 1, maxCapacity: 5, fuelConsumption: 0.097, hireCostPerDay: 144, minDays: 3, maxDays: 10 },
            { type: 'Motor Home', minCapacity: 2, maxCapacity: 6, fuelConsumption: 0.17, hireCostPerDay: 200, minDays: 2, maxDays: 15 }
        ];

        let availableOptions = options.filter(option => option.minCapacity <= numPeople && option.maxCapacity >= numPeople && option.minDays <= travelDays && option.maxDays >= travelDays);

        let message = '';
        if (availableOptions.length === 0) {
            if (!options.some(option => option.minCapacity <= numPeople && option.maxCapacity >= numPeople)) {
                message = 'No options available for the number of people specified.';
            } else if (!options.some(option => option.minDays <= travelDays && option.maxDays >= travelDays)) {
                message = 'No options available for the number of travel days specified.';
            } else {
                message = 'No options available for the specified criteria.';
            }
        }

        return { options: availableOptions, message: message };
    }

    function displayTransportOptions(options, message) {
        let optionsDiv = $('#options');
        optionsDiv.empty();

        if (options.length === 0) {
            optionsDiv.append(`<p>${message}</p>`);
            $('#costDetails').hide();
        } else {
            options.forEach(option => {
                let optionDiv = $(`
                    <div class="option">
                        <h3>${option.type}</h3>
                        <p>Capacity: ${option.minCapacity}-${option.maxCapacity} people</p>
                        <p>Fuel Consumption: ${(option.fuelConsumption * 100).toFixed(2)}L/100km</p>
                        <p>Hire Cost: $${option.hireCostPerDay}/day (Min: ${option.minDays} days, Max: ${option.maxDays} days)</p>
                        <button class="calculateCost" data-type="${option.type}" data-fuel="${option.fuelConsumption}" data-hire="${option.hireCostPerDay}">Calculate Cost</button>
                    </div>
                `);
                optionsDiv.append(optionDiv);
            });
            $('#costDetails').hide();
        }

        $('#transportOptions').show();

        $('.calculateCost').on('click', function () {
            let fuelConsumption = $(this).data('fuel');
            let hireCostPerDay = $(this).data('hire');
            let distance = $('#distance').val();
            let travelDays = $('#travelDays').val();
            let costs = calculateCost(fuelConsumption, distance, hireCostPerDay, travelDays);
            displayCost(costs);
        });
    }

    function calculateCost(fuelConsumption, distance, hireCostPerDay, travelDays) {
        let fuelPricePerLiter = 1.5; // Assume $1.5 per liter
        let totalFuel = (fuelConsumption * distance); // Total liters of fuel needed
        let totalFuelCost = totalFuel * fuelPricePerLiter; // Total cost for fuel
        let totalHireCost = hireCostPerDay * travelDays; // Total hire cost for the number of days
        let totalCost = totalFuelCost + totalHireCost; // Combined total cost
        return { totalFuelCost, totalHireCost, totalCost };
    }

    function displayCost(costs) {
        $('#cost').html(`
            <p class="costTitle">Fuel Cost: </p><p> $${costs.totalFuelCost.toFixed(2)}</p>
            <p class="costTitle">Hire Cost: </p><p>$${costs.totalHireCost.toFixed(2)}</p>
            <p class="costTitle">Total Cost: </p><p>$${costs.totalCost.toFixed(2)}</p>
        `);
        $('#costDetails').show();
    }
});
