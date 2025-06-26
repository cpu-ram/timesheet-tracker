import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecordViewMode } from "../../shared/types/viewModes.ts";
import Navigation from "../../components/Navigation/Navigation.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import JobsiteProps from "../../components/Jobsite/types.ts";

import { useSpacerBlockStyle } from "../../components/shared/styles/recordStyles.ts";
import { useSearchParams } from "react-router-dom";

import { fetchJobsite } from "../../api/jobsiteApi.ts";

import AddJobsiteForm from "../../components/Jobsite/AddJobsiteForm/AddJobsiteForm.tsx";

import JobsitePanel from "../../components/Jobsite/JobsitePanel.tsx";

import {
  createJobsite,
  deleteJobsite,
  updateJobsite,
} from "../../api/jobsiteApi.ts";

import {
  useErrorWrapperStyle,
  useErrorTextStyle,
} from "../../components/Jobsite/AddJobsiteForm/styles.ts";

const JobsitePage = (props: { initialMode: "view" | "create" | "add" }) => {
  const { jobsiteId } = useParams();
  const [mode, setMode] = useState<"view" | "add" | "edit">(
    props.initialMode || "view",
  );
  const [jobsite, setJobsite] = useState<JobsiteProps | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const cancelJobsiteCreation = () => {
    navigate("/jobsites");
  };

  const cancelJobsiteEdit = () => {
    setMode("view");
  };

  const handleJobsiteDelete = async () => {
    try {
      const { success } = await deleteJobsite(jobsiteId);
      if (success) {
        navigate("/jobsites");
      }
    } catch (error) {
      setApiError(error.message);
    }
  };

  const fetchJobsiteData = async () => {
    try {
      if (mode === "view") {
        if (!jobsiteId) {
          throw new Error("Jobsite ID is required");
        }
        const jobsiteData = await fetchJobsite({ jobsiteId: jobsiteId });
        setJobsite(jobsiteData);
      }
    } catch (error) {
      console.error("Error fetching jobsite data:", error);
    }
  };

  useEffect(() => {
    fetchJobsiteData();
  }, []);

  const handleDiscard = () => {
    switch (mode) {
      case "add":
        return cancelJobsiteCreation();
      case "edit":
        return cancelJobsiteEdit();
      default:
        throw new Error('Invalid mode: mode must be either "add" or "edit".');
    }
  };

  const theme = useTheme();

  let handleEnteredData;
  const callUpdateJobsite = (jobsiteProps) =>
    updateJobsite({
      jobsiteData: jobsiteProps,
      onSuccess: (updatedRecord) => setJobsite(updatedRecord),
    });

  switch (mode) {
    case "add":
      handleEnteredData = createJobsite;
      break;
    case "edit":
      handleEnteredData = callUpdateJobsite;
      break;
    default:
      handleEnteredData = undefined;
      break;
  }

  return (
    <Box
      className="jobsite-page"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100% !important',
        minWidth: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',

        padding: '3.2em 0.6em',

        margin: 0,
        backgroundColor: theme.palette.grey[100],
        '& .breadcrumbs': {
          display: 'flex',
          width: '100%',
          border: 0,
        }
      }}
    >
      <Navigation />


      <Box
        className="main-content"
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '4px',
          border: `1px solid ${theme.palette.divider}`,
          border: '0',
        }}>

        <Box
          name="breadcrumbs"
          className="breadcrumbs"
          sx={{
            maxWidth: '45em',
            alignSelf: 'center',
            padding: '0.95em 0',
          }}
        >
          {searchParams.get("fromName") && searchParams.get("fromLink") && (
            <Box
              sx={{
                "& a": {
                  color: "black",
                },
              }}
            >
              <Link to={searchParams.get("fromLink")}>
                <Typography
                  key="back-link"
                  variant="subtitle1"
                  sx={{
                    backgroundColor: theme.palette.grey[200],
                    padding: "0.1em 0.4em",
                    margin: "0.2em 0 0.25em -0.7em",
                    width: "fit-content",
                    borderRadius: "0.25em",
                    border: "1px solid #ccc",
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      position: "relative",
                      top: "0.2em",
                      marginRight: "0.2em",
                      fontSize: "1em",
                    }}
                  />{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 500,
                      textUnderlineOffset: "0.25em",
                      textDecoration: "none",
                    }}
                  >
                    {searchParams.get("fromName")}
                  </Box>
                </Typography>
              </Link>
            </Box>
          )}

          <Typography
            variant="h4"
            sx={{
              padding: "0",
              fontWeight: '700',
              fontSize: '1.8em',
            }}
          >
            <Box
              component="span"
              onClick={() => navigate("/jobsites")}
              sx={{
                borderRadius: "0.25em",
                color: theme.palette.primary.dark,
                "&:hover, &:active": {
                  cursor: "pointer",
                  backgroundColor: "#ddd",
                },
              }}
            >
              Jobsites
            </Box>
            {" > "}
            <i>{jobsiteId ?? "New Jobsite"}</i>
          </Typography>
        </Box>

        <JobsitePanel
          initialMode={mode}
          jobsiteId={jobsiteId}
        />

      </Box>
    </Box>
  );
};

export default JobsitePage;
