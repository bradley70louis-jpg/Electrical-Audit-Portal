import { useEffect, useState } from 'react'
import besLogo from './assets/British Engineering Services Logo.jpg'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('electricalAuditProjects')
    return savedProjects ? JSON.parse(savedProjects) : []
  })

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [projectSearch, setProjectSearch] = useState('')

  const emptyProjectForm = {
    client: '',
    projectName: '',
    reference: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    status: 'Active',
    notes: '',
  }

  const [projectForm, setProjectForm] = useState(emptyProjectForm)

  useEffect(() => {
    localStorage.setItem(
      'electricalAuditProjects',
      JSON.stringify(projects)
    )
  }, [projects])

  const menuItems = [
    { name: 'Dashboard', icon: '⌂' },
    { name: 'Projects', icon: '▦' },
    { name: 'New Audit', icon: '＋' },
    { name: 'Audit History', icon: '✓' },
    { name: 'Actions', icon: '!' },
    { name: 'Electricians', icon: '♙' },
    { name: 'Reports', icon: '▥' },
  ]

  const openNewProjectForm = () => {
    setEditingProjectId(null)
    setProjectForm(emptyProjectForm)
    setShowProjectForm(true)
  }

  const closeProjectForm = () => {
    setEditingProjectId(null)
    setProjectForm(emptyProjectForm)
    setShowProjectForm(false)
  }

  const handleProjectChange = (event) => {
    const { name, value } = event.target

    setProjectForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const saveProject = (event) => {
    event.preventDefault()

    if (!projectForm.client.trim() || !projectForm.projectName.trim()) {
      alert('Please enter the client and project name.')
      return
    }

    if (editingProjectId) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProjectId
            ? {
                ...project,
                ...projectForm,
              }
            : project
        )
      )
    } else {
      const newProject = {
        id: Date.now(),
        ...projectForm,
        audits: 0,
        openActions: 0,
        createdAt: new Date().toISOString(),
      }

      setProjects((currentProjects) => [
        newProject,
        ...currentProjects,
      ])
    }

    closeProjectForm()
  }

  const editProject = (project) => {
    setProjectForm({
      client: project.client,
      projectName: project.projectName,
      reference: project.reference || '',
      contactName: project.contactName || '',
      contactEmail: project.contactEmail || '',
      contactPhone: project.contactPhone || '',
      status: project.status || 'Active',
      notes: project.notes || '',
    })

    setEditingProjectId(project.id)
    setShowProjectForm(true)
  }

  const deleteProject = (projectId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmed) return

    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== projectId
      )
    )
  }

  const filteredProjects = projects.filter((project) => {
    const searchText = projectSearch.toLowerCase()

    return (
      project.client.toLowerCase().includes(searchText) ||
      project.projectName.toLowerCase().includes(searchText) ||
      (project.reference || '').toLowerCase().includes(searchText)
    )
  })

  const activeProjects = projects.filter(
    (project) => project.status === 'Active'
  ).length

  const totalProjectAudits = projects.reduce(
    (total, project) => total + (project.audits || 0),
    0
  )

  const totalProjectActions = projects.reduce(
    (total, project) => total + (project.openActions || 0),
    0
  )

  const renderDashboard = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <h1>Dashboard</h1>
            <p>Electrical compliance audit management</p>
          </div>

          <button
            className="new-audit-button"
            onClick={() => setActivePage('New Audit')}
          >
            + New Audit
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Audits This Month</span>
            <strong>0</strong>
            <small>Completed audits</small>
          </div>

          <div className="stat-card">
            <span>Average Score</span>
            <strong>—</strong>
            <small>No audits recorded</small>
          </div>

          <div className="stat-card">
            <span>Action Required</span>
            <strong>{totalProjectActions}</strong>
            <small>Outstanding issues</small>
          </div>

          <div className="stat-card">
            <span>Active Projects</span>
            <strong>{activeProjects}</strong>
            <small>Current contracts</small>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Recent Audits</h2>
                <p>Your latest electrical compliance audits</p>
              </div>

              <button
                className="text-button"
                onClick={() => setActivePage('Audit History')}
              >
                View all
              </button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No audits yet</h3>
              <p>
                Complete your first electrical audit to see it here.
              </p>

              <button
                className="secondary-button"
                onClick={() => setActivePage('New Audit')}
              >
                Create first audit
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>Common audit tasks</p>
              </div>
            </div>

            <div className="quick-actions">
              <button onClick={() => setActivePage('New Audit')}>
                <span>＋</span>
                <div>
                  <strong>Start New Audit</strong>
                  <small>Create an electrical compliance audit</small>
                </div>
              </button>

              <button onClick={() => setActivePage('Projects')}>
                <span>▦</span>
                <div>
                  <strong>Projects</strong>
                  <small>Manage clients and audit projects</small>
                </div>
              </button>

              <button onClick={() => setActivePage('Actions')}>
                <span>!</span>
                <div>
                  <strong>Outstanding Actions</strong>
                  <small>Review issues requiring attention</small>
                </div>
              </button>

              <button onClick={() => setActivePage('Electricians')}>
                <span>♙</span>
                <div>
                  <strong>Electricians</strong>
                  <small>View engineer audit performance</small>
                </div>
              </button>

              <button onClick={() => setActivePage('Reports')}>
                <span>▥</span>
                <div>
                  <strong>Reports</strong>
                  <small>Review audit trends and defects</small>
                </div>
              </button>
            </div>
          </section>
        </div>
      </>
    )
  }

  const renderProjects = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <h1>Projects</h1>
            <p>
              Manage clients, contracts and electrical audit projects
            </p>
          </div>

          <button
            className="new-audit-button"
            onClick={openNewProjectForm}
          >
            + Add Project
          </button>
        </div>

        <div className="project-stats">
          <div className="project-stat-card">
            <span>Total Projects</span>
            <strong>{projects.length}</strong>
          </div>

          <div className="project-stat-card">
            <span>Active Projects</span>
            <strong>{activeProjects}</strong>
          </div>

          <div className="project-stat-card">
            <span>Total Audits</span>
            <strong>{totalProjectAudits}</strong>
          </div>

          <div className="project-stat-card">
            <span>Open Actions</span>
            <strong>{totalProjectActions}</strong>
          </div>
        </div>

        {showProjectForm && (
          <section className="project-form-card">
            <div className="project-form-heading">
              <div>
                <h2>
                  {editingProjectId
                    ? 'Edit Project'
                    : 'Add New Project'}
                </h2>

                <p>
                  Enter the client and contract information below.
                </p>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={closeProjectForm}
              >
                ×
              </button>
            </div>

            <form
              className="project-form"
              onSubmit={saveProject}
            >
              <div className="form-group">
                <label>Client *</label>

                <input
                  type="text"
                  name="client"
                  value={projectForm.client}
                  onChange={handleProjectChange}
                  placeholder="e.g. Housing Association"
                />
              </div>

              <div className="form-group">
                <label>Project / Contract Name *</label>

                <input
                  type="text"
                  name="projectName"
                  value={projectForm.projectName}
                  onChange={handleProjectChange}
                  placeholder="e.g. Electrical Compliance Contract"
                />
              </div>

              <div className="form-group">
                <label>Project Reference</label>

                <input
                  type="text"
                  name="reference"
                  value={projectForm.reference}
                  onChange={handleProjectChange}
                  placeholder="e.g. BES-001"
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={projectForm.status}
                  onChange={handleProjectChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Client Contact</label>

                <input
                  type="text"
                  name="contactName"
                  value={projectForm.contactName}
                  onChange={handleProjectChange}
                  placeholder="Contact name"
                />
              </div>

              <div className="form-group">
                <label>Contact Email</label>

                <input
                  type="email"
                  name="contactEmail"
                  value={projectForm.contactEmail}
                  onChange={handleProjectChange}
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label>Contact Telephone</label>

                <input
                  type="text"
                  name="contactPhone"
                  value={projectForm.contactPhone}
                  onChange={handleProjectChange}
                  placeholder="Telephone number"
                />
              </div>

              <div className="form-group form-group-wide">
                <label>Project Notes</label>

                <textarea
                  name="notes"
                  value={projectForm.notes}
                  onChange={handleProjectChange}
                  placeholder="Project requirements, audit targets or other notes..."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeProjectForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="new-audit-button"
                >
                  {editingProjectId
                    ? 'Save Changes'
                    : 'Create Project'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="projects-panel">
          <div className="projects-toolbar">
            <div>
              <h2>All Projects</h2>
              <p>
                Select a project to manage audits and actions.
              </p>
            </div>

            <input
              className="project-search"
              type="search"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(event) =>
                setProjectSearch(event.target.value)
              }
            />
          </div>

          {filteredProjects.length === 0 ? (
            <div className="projects-empty">
              <div className="projects-empty-icon">▦</div>

              <h3>
                {projects.length === 0
                  ? 'No projects created'
                  : 'No projects found'}
              </h3>

              <p>
                {projects.length === 0
                  ? 'Create your first client project to begin carrying out audits.'
                  : 'Try changing your search.'}
              </p>

              {projects.length === 0 && (
                <button
                  className="secondary-button"
                  onClick={openNewProjectForm}
                >
                  + Add First Project
                </button>
              )}
            </div>
          ) : (
            <div className="projects-table-wrapper">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Project / Contract</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Audits</th>
                    <th>Open Actions</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.client}</strong>
                      </td>

                      <td>{project.projectName}</td>

                      <td>
                        {project.reference || '—'}
                      </td>

                      <td>
                        <span
                          className={
                            project.status === 'Active'
                              ? 'status-badge active-status'
                              : 'status-badge inactive-status'
                          }
                        >
                          {project.status}
                        </span>
                      </td>

                      <td>{project.audits || 0}</td>

                      <td>
                        <span
                          className={
                            project.openActions > 0
                              ? 'action-count has-actions'
                              : 'action-count'
                          }
                        >
                          {project.openActions || 0}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            onClick={() => editProject(project)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              deleteProject(project.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    )
  }

  const renderPlaceholder = () => {
    let description =
      'This section is ready for us to build next.'

    if (activePage === 'New Audit') {
      description =
        'Create a new electrical compliance audit.'
    }

    if (activePage === 'Audit History') {
      description =
        'View completed and previous electrical audits.'
    }

    if (activePage === 'Actions') {
      description =
        'Review and manage outstanding actions raised from audits.'
    }

    if (activePage === 'Electricians') {
      description =
        'Manage electricians and review individual audit performance.'
    }

    if (activePage === 'Reports') {
      description =
        'Review audit performance, trends and compliance reports.'
    }

    return (
      <div className="page-placeholder">
        <h1>{activePage}</h1>
        <p>{description}</p>
      </div>
    )
  }

  const renderPage = () => {
    if (activePage === 'Dashboard') {
      return renderDashboard()
    }

    if (activePage === 'Projects') {
      return renderProjects()
    }

    return renderPlaceholder()
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-box">
            <img
              src={besLogo}
              alt="British Engineering Services Group"
            />
          </div>

          <div className="portal-name">
            <strong>Electrical</strong>
            <span>Audit Portal</span>
          </div>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name ? 'active' : ''
              }
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">BL</div>

          <div>
            <strong>Brad Louis</strong>
            <span>Electrical Area Manager</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="status-dot"></span>
            British Engineering Services Group
          </div>

          <div className="topbar-right">
            <strong>Electrical Audit Portal</strong>
          </div>
        </header>

        <div className="content">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App