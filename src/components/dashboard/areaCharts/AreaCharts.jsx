import AreaBarChart from "./AreaBarChart";
import AreaProgressChart from "./AreaProgressChart";
import PropTypes from "prop-types";

const AreaCharts = ({ barChartData, progressData, totalSales }) => {
  return (
    <section className="content-area-charts">
      <AreaBarChart
        data={barChartData}
        totalSales={totalSales.totalSales.amount}
      />
      <AreaProgressChart data={progressData} />
    </section>
  );
};

AreaCharts.propTypes = {
  barChartData: PropTypes.object.isRequired,
  progressData: PropTypes.object.isRequired,
  totalSales: PropTypes.object.isRequired,
};

export default AreaCharts;
