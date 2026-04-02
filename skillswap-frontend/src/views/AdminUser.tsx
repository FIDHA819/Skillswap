// src/pages/AdminUsers.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { AdminViewModel } from "../viewModels/admin.viewModel";
import { runInAction } from "mobx";

const adminVM = new AdminViewModel();

const AdminUsers: React.FC = observer(() => {
  const [selectedKycUser, setSelectedKycUser] = useState<any | null>(null);

  useEffect(() => {
    adminVM.fetchUsers();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users & KYC Verification</h1>

      {adminVM.loading && <p className="text-gray-600">Loading users...</p>}
      {adminVM.error && <p className="text-red-500">{adminVM.error}</p>}

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 uppercase text-gray-600 text-xs">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Skills to Teach</th>
              <th className="p-3 border">KYC Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminVM.users.map((user) => {
              const isTeacher = user.skillsToTeach && user.skillsToTeach.length > 0;
              const roles = ["student"];
              if (isTeacher) roles.push("teacher");

              return roles.map((role, idx) => (
                <tr key={user._id + role} className="border-b hover:bg-gray-50">
                  {/* Name/Email only for first row */}
                  <td className="p-3">{idx === 0 ? user.fullName : ""}</td>
                  <td className="p-3">{idx === 0 ? user.email : ""}</td>

                  {/* Role */}
                  <td className="p-3 font-semibold">{role}</td>

                  {/* Skills */}
                  <td className="p-3">{role === "teacher" ? user.skillsToTeach.join(", ") : "-"}</td>

                  {/* KYC Status */}
                  <td className="p-3">
                    {role === "teacher" && user.teacherKycStatus ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.teacherKycStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : user.teacherKycStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.teacherKycStatus}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2 justify-center">
                    {role === "teacher" && user.teacherKycStatus === "pending" ? (
                      <>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={async () => {
                            await adminVM.updateKyc(user._id, "approved");
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={async () => {
                            await adminVM.updateKyc(user._id, "rejected");
                          }}
                        >
                          Reject
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => setSelectedKycUser(user)}
                        >
                          View KYC
                        </button>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for KYC */}
      {selectedKycUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              KYC Details - {selectedKycUser.fullName}
            </h2>
            {selectedKycUser.kycDocuments?.length > 0 ? (
              <ul className="space-y-2">
                {selectedKycUser.kycDocuments.map((doc: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {doc.name || `Document ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No KYC documents submitted</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={async () => {
                  await adminVM.updateKyc(selectedKycUser._id, "approved");
                  setSelectedKycUser(null);
                }}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  await adminVM.updateKyc(selectedKycUser._id, "rejected");
                  setSelectedKycUser(null);
                }}
              >
                Reject
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setSelectedKycUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminUsers;
