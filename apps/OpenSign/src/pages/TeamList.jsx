import React, { useEffect, useState } from "react";
import Parse from "parse";
import Alert from "../primitives/Alert";
import Loader from "../primitives/Loader";
import ModalUi from "../primitives/ModalUi";
import pad from "../assets/images/pad.svg";
import { useTranslation } from "react-i18next";
import { withSessionValidation } from "../utils";

const heading = ["Sr.No", "Name", "Parent Team", "Team status", "Edit"];
const TeamList = () => {
  const { t } = useTranslation();
  const [teamList, setTeamList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isModal, setIsModal] = useState({ form: false, editId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAlert, setIsAlert] = useState({ type: "success", msg: "" });
  const [activeModal, setActiveModal] = useState({});
  const [actLoader, setActLoader] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ name: "", parentId: "", isActive: true });
  const [formLoader, setFormLoader] = useState(false);
  const recordperPage = 10;

  useEffect(() => {
    fetchTeamList();
  }, []);

  const extUser =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("Extand_Class") &&
    JSON.parse(localStorage.getItem("Extand_Class"))?.[0];

  useEffect(() => {
    if (extUser) {
      const admin =
        extUser?.UserRole === "contracts_Admin" || extUser?.UserRole === "contracts_OrgAdmin";
      setIsAdmin(admin);
    }
  }, [extUser?.UserRole]);

  async function fetchTeamList() {
    try {
      setIsLoader(true);
      const res = await Parse.Cloud.run("getteams", { active: false });
      const list = JSON.parse(JSON.stringify(res || []));
      setTeamList(list);
    } catch (err) {
      console.error("Err in fetch team list", err);
      showAlert("danger", t("something-went-wrong-mssg"));
    } finally {
      setIsLoader(false);
    }
  }

  const getPaginationRange = () => {
    const totalPageNumbers = 7;
    const pages = [];
    const totalPages = Math.ceil(teamList.length / recordperPage) || 1;
    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(currentPage - 1, 1);
      const right = Math.min(currentPage + 1, totalPages);
      const showLeft = left > 2;
      const showRight = right < totalPages - 2;
      if (!showLeft && showRight) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (showLeft && !showRight) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", left, currentPage, right, "...", totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPaginationRange();
  const indexOfLast = currentPage * recordperPage;
  const indexOfFirst = indexOfLast - recordperPage;
  const currentList = teamList.slice(indexOfFirst, indexOfLast);

  const showAlert = (type, msg, timer = 1500) => {
    setIsAlert({ type, msg });
    setTimeout(() => setIsAlert({ type: "success", msg: "" }), timer);
  };

  const handleModal = (modalName, editId = null) => {
    setIsModal((prev) => ({
      form: modalName === "form",
      editId: editId ?? prev.editId,
    }));
    if (modalName === "form" && editId) {
      const team = teamList.find((x) => x.objectId === editId);
      if (team) {
        setFormData({
          name: team.Name || "",
          parentId: team.ParentId?.objectId || "",
          isActive: team.IsActive !== false,
        });
      }
    } else if (modalName !== "form") {
      setFormData({ name: "", parentId: "", isActive: true });
    }
  };

  const handlePaginate = (page) => {
    if (page !== "...") setCurrentPage(page);
  };

  const handleSubmit = withSessionValidation(async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showAlert("danger", t("name-of-team") || "Team name is required.");
      return;
    }
    setFormLoader(true);
    try {
      const params = {
        name: formData.name.trim(),
        parentId: formData.parentId || undefined,
        isActive: formData.isActive,
      };
      if (isModal.editId) params.objectId = isModal.editId;
      await Parse.Cloud.run("saveteam", params);
      await fetchTeamList();
      showAlert("success", t("Team-update-successfully") || "Team saved successfully.");
      setIsModal({ form: false, editId: null });
      setFormData({ name: "", parentId: "", isActive: true });
    } catch (err) {
      const msg = err?.message || t("something-went-wrong-mssg");
      showAlert("danger", msg);
    } finally {
      setFormLoader(false);
    }
  });

  const handleToggleActive = withSessionValidation(async (team) => {
    setActiveModal({});
    setActLoader({ [team.objectId]: true });
    try {
      await Parse.Cloud.run("saveteam", {
        objectId: team.objectId,
        name: team.Name,
        parentId: team.ParentId?.objectId,
        isActive: !team.IsActive,
      });
      await fetchTeamList();
      showAlert(
        "success",
        team.IsActive ? t("team-disabled") : t("Team enabled")
      );
    } catch (err) {
      showAlert("danger", err?.message || t("something-went-wrong-mssg"));
    } finally {
      setActLoader({});
    }
  });

  const parentTeamOptions = teamList.filter(
    (t) => t.objectId !== isModal.editId
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full bg-base-100 text-base-content rounded-box">
        <div className="text-center">
          <h1 className="text-[60px] lg:text-[120px] font-semibold">404</h1>
          <p className="text-[30px] lg:text-[50px]">{t("page-not-found")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoader && (
        <div className="absolute w-full h-[300px] md:h-[400px] flex justify-center items-center z-30 rounded-box">
          <Loader />
        </div>
      )}
      {Object.keys(actLoader).length > 0 && (
        <div className="absolute w-full h-full flex justify-center items-center bg-black/30 z-30 rounded-box">
          <Loader />
        </div>
      )}

      {!isLoader && (
        <div className="p-2 w-full bg-base-100 text-base-content op-card shadow-lg">
          {isAlert.msg && <Alert type={isAlert.type}>{isAlert.msg}</Alert>}
          <div className="flex flex-row items-center justify-between my-2 mx-3 text-[20px] md:text-[23px]">
            <div className="font-light">{t("report-name.Teams")}</div>
            <div className="flex flex-row gap-2 items-center">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setFormData({ name: "", parentId: "", isActive: true });
                  handleModal("form");
                }}
                title={t("add-team")}
              >
                <i className="fa-light fa-square-plus text-accent text-[30px] md:text-[40px]"></i>
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="op-table border-collapse w-full mb-[50px]">
              <thead className="text-[14px]">
                <tr className="border-y-[1px]">
                  {heading.map((item, index) => (
                    <th key={index} className="px-4 py-2">
                      {t(`report-heading.${item}`) || item}
                    </th>
                  ))}
                </tr>
              </thead>
              {teamList.length > 0 ? (
                <tbody className="text-[12px]">
                  {currentList.map((item, index) => (
                    <tr className="border-y-[1px]" key={item.objectId}>
                      <th className="px-4 py-2">{indexOfFirst + index + 1}</th>
                      <td className="px-4 py-2 font-semibold">{item.Name || "-"}</td>
                      <td className="px-4 py-2">
                        {item.ParentId?.objectId
                          ? (teamList.find((p) => p.objectId === item.ParentId?.objectId)?.Name ?? "-")
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <label
                          htmlFor={`team-active-${item.objectId}`}
                          className="cursor-pointer relative block items-center mb-0"
                        >
                          <input
                            id={`team-active-${item.objectId}`}
                            type="checkbox"
                            className="op-toggle checked:[--tglbg:#3368ff] transition-all checked:text-white"
                            checked={item.IsActive !== false}
                            onChange={() => setActiveModal({ [item.objectId]: true })}
                          />
                        </label>
                        {activeModal[item.objectId] && (
                          <ModalUi
                            isOpen
                            title={t("Team status")}
                            handleClose={() => setActiveModal({})}
                          >
                            <div className="m-[20px]">
                              <div className="text-lg font-normal text-base-content">
                                {t("are-you-sure")} {item.IsActive ? t("team-disabled") : t("Team enabled")} {t("this-team")}?
                              </div>
                              <hr className="bg-[#ccc] mt-4" />
                              <div className="flex items-center mt-3 gap-2 text-white">
                                <button
                                  onClick={() => handleToggleActive(item)}
                                  className="op-btn op-btn-primary"
                                >
                                  {t("yes")}
                                </button>
                                <button
                                  onClick={() => setActiveModal({})}
                                  className="op-btn op-btn-secondary"
                                >
                                  {t("no")}
                                </button>
                              </div>
                            </div>
                          </ModalUi>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleModal("form", item.objectId)}
                          title={t("edit-team")}
                          className="op-btn op-btn-primary op-btn-sm"
                        >
                          <i className="fa-light fa-pen"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : null}
            </table>
          </div>
          {teamList.length > 0 && teamList.length > recordperPage && (
            <div className="flex flex-row justify-between items-center text-xs font-medium">
              <div className="op-join flex flex-wrap items-center p-2">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className="op-join-item op-btn op-btn-sm"
                >
                  {t("prev")}
                </button>
                {pageNumbers.map((x, i) => (
                  <button
                    key={i}
                    onClick={() => handlePaginate(x)}
                    disabled={x === "..."}
                    className={`${x === currentPage ? "op-btn-active" : ""} op-join-item op-btn op-btn-sm`}
                  >
                    {x}
                  </button>
                ))}
                <button
                  onClick={() =>
                    currentPage < pageNumbers[pageNumbers.length - 1] &&
                    setCurrentPage(currentPage + 1)
                  }
                  className="op-join-item op-btn op-btn-sm"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}
          {teamList.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full bg-base-100 text-base-content rounded-xl py-4">
              <div className="w-[60px] h-[60px] overflow-hidden">
                <img className="w-full h-full object-contain" src={pad} alt="img" />
              </div>
              <div className="text-sm font-semibold">{t("team-not-found")}</div>
            </div>
          )}

          <ModalUi
            isOpen={isModal.form}
            title={isModal.editId ? t("edit-team") : t("add-team")}
            handleClose={() => handleModal("close")}
          >
            <form
              onSubmit={handleSubmit}
              className="shadow-md rounded-box my-[1px] p-3 bg-base-100 relative"
            >
              {formLoader && (
                <div className="absolute inset-0 flex justify-center items-center bg-base-content/30 z-50 rounded-box">
                  <Loader />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="team-name" className="block text-xs font-semibold">
                  {t("name-of-team")} <span className="text-[red]">*</span>
                </label>
                <input
                  id="team-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="op-input op-input-bordered op-input-sm w-full text-xs"
                  placeholder={t("name-of-team")}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="team-parent" className="block text-xs font-semibold">
                  {t("Parent Team")}
                </label>
                <select
                  id="team-parent"
                  value={formData.parentId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, parentId: e.target.value }))
                  }
                  className="op-select op-select-bordered op-select-sm w-full text-xs"
                >
                  <option value="">—</option>
                  {parentTeamOptions.map((opt) => (
                    <option key={opt.objectId} value={opt.objectId}>
                      {opt.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <input
                  id="team-active"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="op-toggle checked:[--tglbg:#3368ff]"
                />
                <label htmlFor="team-active" className="text-xs font-semibold">
                  {t("Team status")} (Active)
                </label>
              </div>
              <div className="flex items-center mt-3 gap-2 text-white">
                <button type="submit" className="op-btn op-btn-primary">
                  {t("submit")}
                </button>
                <button
                  type="button"
                  onClick={() => handleModal("close")}
                  className="op-btn op-btn-secondary"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </ModalUi>
        </div>
      )}
    </div>
  );
};

export default TeamList;
