function dump(){

  const viewExaminationTypes = async () => {
    setLoading(true);
    const path = "viewExamTypes";

    const res = await httpService(path);

    if (res) {
      setExaminationTypes(res.data);
      setLoading(false);
    }
    setLoading(false);
  };

  
  const existed = (text) => {
    const exist = questionBanks.find((c) => c.text === text);

    if (exist) return true;
    return false;
  };

  const createExamination = () => {
    if (examTitle === "") return alert("Please enter an examination title");
    Swal.fire({
      icon: "question",
      title: "Please confirm",
      text: "Do you wish to create this examination?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let banks = [];

        questionBanks.forEach((c) => banks.push(c.value));
        const path = "createExamination";

        const res = await httpService.post(path, {
          questionBanks: banks,
          title: examTitle,
        });

        if (res) {
          Swal.fire({
            icon: "success",
            title: "SUCCESS",
            text: res.data,
            timer: 3000,
          }).then(() => window.location.assign("/createdExamination"));
        }
      }
    });
  };

  const deleteExaminationTypes = () => {
    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Do you want to delete all examination types?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "deleteExaminationType";
        const res = await httpService.delete(path);
        if (res) {
          viewExaminationTypes();
          Swal.fire({ icon: "success", title: res.data });
        }
      }
    });
  };
    return <div className="row mb-5">
    <div className="col-md-5">
      <form onSubmit={createExamType}>
        <TextField
          label="Examination Type"
          fullWidth
          required
          value={examType}
          helperText="This is the examination type a candidate can select during a registration"
          onChange={(e) => setExamType(e.target.value)}
        />
        <br />
        <Button variant="contained" className="mt-2" type="submit">
          {loading ? <Spinner animation="border" /> : "create"}
        </Button>
      </form>
    </div>
    <div className="col-md-7 border-start">
      <div className="d-flex justify-content-between">
        <Typography gutterBottom>Created Examination Types</Typography>
        <Button color="error" onClick={deleteExaminationTypes}>
          Delete examination types
        </Button>
      </div>

      <Table>
        <thead border>
          <tr>
            <th>Exam Type</th>
            <th>Sets</th>
          </tr>
        </thead>
        <tbody>
          {examinationTypes.map((c, i) => (
            <tr
              key={i}
              onClick={() =>
                window.location.assign(`/questionBank/${c._id}`)
              }
              className="myTable"
            >
              <td>{c.examType}</td>
              <td>{c.questionBanks.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>

  <div className="bg-light p-3 mt-3">
    <Typography variant="body1" fontWeight={600}>
      Create Examination to download
    </Typography>

    <div className="mt-4">
      <Stack direction="row" spacing={2}>
        <div>
          <TextField
            label="Examination Title"
            helperText="Enter the name of this examination"
            onChange={(e) => setExamTitle(e.target.value)}
          />
        </div>
      </Stack>
    </div>
    <div className="mt-3">
      <div className="col-md-4">
        <Typography variant="body2" color="GrayText">
          Create the questions for this examination from different
          question banks under each paper type
        </Typography>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div>
            {examinationTypes.map((c, i) => (
              <div key={i} className="p-3 mb-2 shadow rounded">
                <Typography
                  fontWeight={600}
                  textTransform={"uppercase"}
                  gutterBottom
                >
                  {c.examType}
                </Typography>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Question Banks
                  </FormLabel>
                  <FormGroup aria-label="position" row>
                    {c.questionBanks.map((d, p) => (
                      <FormControlLabel
                        key={p}
                        value={d}
                        control={
                          <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                            onChange={(e) => {
                              if (
                                e.target.checked &&
                                !existed(`${c.examType} Bank ${p + 1}`)
                              ) {
                                setQuestionBanks((oldArray) => [
                                  ...oldArray,
                                  {
                                    value: e.target.value,
                                    text: `${c.examType} Bank ${p + 1}`,
                                  },
                                ]);
                              } else if (
                                !e.target.checked &&
                                existed(`${c.examType} Bank ${p + 1}`)
                              ) {
                                const newBank = questionBanks.filter(
                                  (c) => c.value !== e.target.value
                                );
                                setQuestionBanks(newBank);
                              }
                            }}
                            sx={{
                              color: pink[800],
                              "&.Mui-checked": {
                                color: pink[600],
                              },
                            }}
                          />
                        }
                        label={`Bank ${p + 1}`}
                        labelPlacement="end"
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6 border-start">
          <div className="p-4 shadow rounded">
            <div>
              <Typography variant="h3" fontWeight={600}>
                {examTitle}
              </Typography>
            </div>
            <div className="mt-2 mb-5">
              <Typography color="GrayText">
                Selected Question banks
              </Typography>
              <div className="mt-4">
                {questionBanks.map((c, i) => (
                  <Typography gutterBottom key={i}>
                    <i class="fas fa-arrow-right    "></i> {c.text}
                  </Typography>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outlined"
                  disabled={questionBanks.length === 0 ? true : false}
                  onClick={createExamination}
                >
                  Create examination
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}