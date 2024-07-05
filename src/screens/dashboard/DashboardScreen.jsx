//::================================>>Core library<<================================::
//::================================================================================::

//::================================>>Third party<<=================================::
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { useEffect, useState } from "react";
import { AreaCards, AreaCharts } from "../../components";
import makeAPIRequest from "../../services/makeAPIRequest";
import { Modal, Space, Spin, message } from "antd";
import { useForm } from "react-hook-form";
import MainPage from "../../components/page/MainPage";
//::================================================================================::

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [isPendding, setIsPendding] = useState(false);
  const onSubmit = async (data) => {
    setIsPendding(true);
    try {
      const response = await makeAPIRequest("PATCH", "dashboard", data);
      if (response) {
        fetchData();
        setUpdateModal(false);
        message.success("Updated successfully");
        reset();
      }
    } catch (error) {
      message.error("Something went wrong!");
    } finally {
      setIsPendding(false);
    }
  };

  const openModal = async () => {
    setUpdateModal(true);
    try {
      const response = await makeAPIRequest("GET", "dashboard/achieve");
      setValue("achievedSales", response.achievedSales);
      setValue("achievedSalesToday", response.achievedSalesToday);
      setValue("achievedCustomers", response.achievedCustomers);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await makeAPIRequest("GET", "dashboard");
      const responseChart = await makeAPIRequest("GET", "dashboard/chart");
      setBarChartData(responseChart.barChartData);
      setProgressData(responseChart.progressData);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || data === null) {
    return (
      <div className="spinner-container">
        <Spin />
      </div>
    );
  }

  return (
    <MainPage pageName="Dashboard">
      <button onClick={openModal} className="achieved-gold">
        Edit Achieve Gold
      </button>
      <AreaCards data={data} />
      <AreaCharts
        barChartData={barChartData}
        progressData={progressData}
        totalSales={data}
      />
      <Modal
        title="Update Achieve Gold"
        open={updateModal}
        onOk={() => setUpdateModal(false)}
        onCancel={() => setUpdateModal(false)}
        footer={false}
      >
        <section className="my-form-section">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space style={{ width: "100%" }} direction="vertical">
              <p style={{ color: "grey" }}>
                Total Sales <span style={{ color: "red" }}>*</span>
              </p>
              <input
                className="my-input"
                {...register("achievedSales", { required: true })}
                type="number"
                placeholder="Total Sales"
              />
              <p style={{ color: "grey" }}>
                Today Sales <span style={{ color: "red" }}>*</span>
              </p>
              <input
                className="my-input"
                {...register("achievedSalesToday", { required: true })}
                type="number"
                placeholder="Today Sales"
              />
              <p style={{ color: "grey" }}>
                Total Customers <span style={{ color: "red" }}>*</span>
              </p>
              <input
                className="my-input"
                {...register("achievedCustomers", { required: true })}
                type="number"
                placeholder="Total Customers"
              />
            </Space>
            <div className="btn-create-form">
              <Space>
                <div onClick={() => setUpdateModal(false)} className="my-btn">
                  Cancel
                </div>
                <button disabled={isPendding} type="submit" className="my-btn">
                  Update
                </button>
              </Space>
            </div>
          </form>
        </section>
      </Modal>
    </MainPage>
  );
};

export default Dashboard;
