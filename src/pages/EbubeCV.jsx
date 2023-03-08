import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUniversity,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";

import {
  EmailOutlined,
  LocationCityOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import React from "react";

export default function EbubeCV() {
  return (
    <div>
      <div className="container mt-5 mb-5">
        <div
          style={{ minHeight: 80, backgroundColor: "#50409a" }}
          className="p-3 text-white mb-5"
        >
          <Typography
            variant="h4"
            fontWeight={100}
            textAlign={"center"}
            letterSpacing={2}
          >
            EBUBE EMMANUEL IKECHUKWU
          </Typography>
        </div>
        <div
          className="mb-5 col-md-4 p-3 border rounded"
          style={{ borderColor: "#50409a" }}
        >
          <Typography className="mb-3">
            <LocationCityOutlined /> Abuja, Nigeria
          </Typography>
          <Typography className="mb-3">
            <EmailOutlined /> ebusue2000@gmail.com
          </Typography>
          <Typography className="mb-3">
            <PhoneOutlined /> +234 808 533 3602
          </Typography>
        </div>
        <div className="mb-2">
          <Typography variant="h4" fontWeight={300}>
            <FontAwesomeIcon icon={faUserGraduate} />
            <span> ACADEMIC ROADMAP</span>
          </Typography>
          <hr />
        </div>
        <div>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Tertiary Education <FontAwesomeIcon icon={faUniversity} />
          </Typography>
          <div>
            <Stack direction="row" spacing={2}>
              <div className="border-end pe-2">
                <Typography variant="h4" fontWeight={300} gutterBottom>
                  Enugu State University of Technology
                </Typography>
                <div>
                  <Typography fontStyle={"italic"} variant="subtitle1">
                    2016 - 2022
                  </Typography>
                </div>
              </div>
              <div>
                <Typography fontWeight={700} variant="h4">
                  CGPA: 3.97
                </Typography>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
}
