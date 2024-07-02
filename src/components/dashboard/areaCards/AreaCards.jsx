import PropTypes from "prop-types";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = ({ data }) => {
  const format = (number) => {
    return number.toFixed(2);
  };
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={format(data.totalSales.achieved)}
        cardInfo={{
          title: "Total Sales",
          value: `$${format(data.totalSales.amount)}`,
          text: "Amount of total sales.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={format(data.totalSalesToday.achieved)}
        cardInfo={{
          title: "Todays Sales",
          value: `$${format(data.totalSalesToday.amount)}`,
          text: `We have sold ${data.totalSalesToday.items} items.`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={format(data.totalCustomers.achieved)}
        cardInfo={{
          title: "Total Customers",
          value: `${format(data.totalCustomers.amount)}`,
          text: "Get total customers.",
        }}
      />
    </section>
  );
};

AreaCards.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AreaCards;
