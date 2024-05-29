/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination, Popconfirm, message } from "antd";
import MainPage from "../../../components/page/MainPage";
import "./LogScreen.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import makeAPIRequest from "../../../services/makeAPIRequest";
import SpinLayout from "../../../components/general/spin/SpinLayout";
import { RiDeleteBinFill } from "react-icons/ri";
import { convertToCambodiaTime } from "../../../utils/help/help";
const LogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
  });
  //::===============================>>Screen action<<================================::
  const logoutDevice = async (sessionToken) => {
    try {
      await makeAPIRequest(
        "DELETE",
        `auth/account/logoutDevice/${sessionToken}`
      );
      getLogs();
      message.success("Remove successfully");
    } catch (error) {
      message.error("Something error");
    }
  };
  const getLogs = async () => {
    try {
      const data = await makeAPIRequest(
        "GET",
        "auth/getSession/getAll?page=" + pagination.currentPage
      );
      setLogs(data.data);
      setPagination({
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      });
    } catch (error) {
      message.error("Something error");
    }
  };
  useEffect(() => {
    getLogs();
  }, [pagination.currentPage]);
  const paginationChange = (current, size) => {
    setPagination({ ...pagination, currentPage: current });
    console.log(`${current}, ${size}`);
  };
  //::================================================================================::
  const confirm = (sessionToken) => {
    logoutDevice(sessionToken);
  };
  return (
    <MainPage pageName="Profile">
      <div className="profile-header">
        <Link
          to="/profile"
          className={`profile-btn ${
            location.pathname === "/profile" ? "profile-btn-active" : ""
          }`}
        >
          <p className="profile-p">Profile</p>
        </Link>
        <Link
          to="/profile/log"
          className={`profile-btn ${
            location.pathname === "/profile/log" ? "profile-btn-active" : ""
          }`}
        >
          <p className="profile-p">Log</p>
        </Link>
      </div>
      {logs.lenght <= 0 ? (
        <SpinLayout />
      ) : (
        <>
          {/* start table section */}
          <section className="admin-user-table">
            <div className="admin-user-table-header">
              <div className="device">Device</div>
              <div className="browser">Browser</div>
              <div className="date">Login Date</div>
              <div className="action-emp">Action</div>
            </div>
            {logs.map((log) => (
              <div className="admin-user-table-header-data" key={log.id}>
                <div className="device">{log.device}</div>
                <div className="browser">{log.browser}</div>
                <div className="date">
                  {convertToCambodiaTime(log.createdAt)}
                </div>
                <div className="action-emp">
                  <Popconfirm
                    title="Remove device"
                    description="Are you sure to remove this device?"
                    onConfirm={() => confirm(log.sessionToken)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className="btn-action">
                      <RiDeleteBinFill size={20} color="red" />
                    </button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </section>
          {/* end table section */}
          {/* start pagination section */}
          <section className="admin-user-pagination">
            <Pagination
              size="small"
              onChange={(current, size) => paginationChange(current, size)}
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              total={pagination.totalCount}
            />
          </section>
          {/* end pagination section */}
        </>
      )}
    </MainPage>
  );
};

export default LogScreen;
