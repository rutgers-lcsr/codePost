# The Assignment Lifecycle — Instructor Guide

Every assignment on codePost carries two colored badges in your Assignments table:

- **Status** — controls the *work*: whether students see the assignment, can read its
  files, and can submit.
- **Feedback** — controls the *grading*: whether students see grades, comments, and
  the rubric.

Click either badge to open a picker where every option explains itself. Nothing is
visible to students until you say so. This guide covers Status first, then Feedback.

```
Draft ──▶ Visible ──▶ Preview ──▶ Published ──▶ Closed ──▶ Archived
(build)   (announce)  (hand out)  (open for      (no more    (retire)
                                   work)          submitting)
```

You don't have to use every stage — most assignments go straight from **Draft** to
**Published** — and you can move backwards at any time (for example, un-publish back to
Preview if you spot a mistake in the hand-out).

## What each status means

| Status | Students see it | Students can read the files | Students can submit | Typical use |
|---|:---:|:---:|:---:|---|
| **Draft** | ✗ | ✗ | ✗ | You're still writing it. Invisible to students. |
| **Visible** | ✓ | ✗ | ✗ | An announcement: students see the name, due date, points, and your assignment description on their dashboard so they can plan ahead. |
| **Preview** | ✓ | ✓ | ✗ | The hand-out is readable — students can download the files and set up their environment, but can't submit yet. |
| **Published** | ✓ | ✓ | ✓ | Open for work. Students download files and submit (submitting also requires **Allow student upload** in the assignment's settings). |
| **Closed** | ✓ | ✓ | ✗ | Submitting is over. Students still see the assignment and their own submission. |
| **Archived** | ✗ | ✗ | ✗ | Retired mid-course — disappears from student dashboards. Grades already given still count. |

A few behaviors worth knowing:

- **Your description travels with the assignment.** The description you write in
  settings appears on the student's dashboard (they expand the assignment row to read
  it) and above their files while they work — from Visible onward.
- **New assignments start as Draft.** So do cloned assignments — cloning also turns off
  student upload and clears due dates, so a copied assignment can never accept
  submissions by accident. Re-enable upload when you're ready.
- **Closed usually happens by itself.** When the submission deadline passes (including
  any late-day window you allow), a Published assignment automatically shows **Closed**
  and stops accepting submissions — you don't have to do anything. The badge shows a
  small clock icon when this happened automatically. To *reopen*, extend the due date.
  To close **early** (say, an exam window ended), set the status to Closed yourself.
- **Publishing is guarded.** codePost asks you to confirm before publishing, and
  reassures you: if grading of existing submissions is still in progress, publishing
  does **not** reveal any of it (see the next section).

## Scheduling a publish

If you want an assignment to open at an exact time (say, Friday 17:00) without you
being at a keyboard, set **Publish at** in the assignment's settings (General tab).

- The schedule only fires while the assignment is **Visible** or **Preview** — a Draft
  never publishes itself, so you can't accidentally schedule something half-written.
- The time is checked every few minutes, so the assignment opens within ~5 minutes of
  the time you set.
- Publishing (scheduled or manual) is recorded in the course audit log.

A common pattern for a big assignment:

1. **Draft** while you write it.
2. **Visible** a week or two ahead — students see it coming on their dashboard.
3. **Preview** a few days early with **Publish at** set — students read the spec and
   set up; submissions open automatically on schedule.
4. It **Closes** by itself at the deadline.

## Grades and feedback: the Feedback column

The status controls the *work* — seeing the assignment, reading files, submitting.
**What students see of their grading is controlled separately by the Feedback column**,
right next to Status:

| Feedback | What students see |
|---|---|
| **Hidden** (default) | Nothing — grade at your own pace. |
| **Live** | Feedback appears immediately as it's written — for office hours and ungraded exercises. |
| **Per student** | Each student sees their grades, comments, and the rubric as soon as *their own* submission is finalized — a rolling release with no global switch. |
| **Released** | Everything is out for all finalized submissions at once. |

Two extras:

- **Hide grades** masks *numeric grades* in any of the revealing modes — students see
  comments and the rubric but no number. Useful for feedback-first grading. Toggle it
  with the grades button on the assignment row (the `#` turns into a crossed-out eye)
  or in Settings → Grading. The button is disabled while Feedback is Hidden, since no
  grades show then anyway.
- **Release at** (settings → Publishing) schedules an automatic move to Released at a
  time you pick — "grades out Friday 5pm" without being at a keyboard.

While an assignment is Published but feedback is Hidden, students still see that their
submission was received — they just can't see inside the grading.

One caveat for quizzes: a quiz timed to the *whole assignment's* feedback release can't
be used with per-student feedback (there's no single release moment) — use the
self-paced quiz trigger instead; codePost will point this out if you try.

## Hiding an assignment from specific sections

The **Hide from** setting (General tab) hides an assignment from students in the
sections you pick — they won't see it on their dashboard and can't open or submit to
it, regardless of status. Useful when different sections run on different schedules.

## Questions we get

**The table says Closed, but when I click it the setting says Published — which is it?**
Both, and that's intentional. Your *setting* is Published; the deadline passed, so
students can no longer submit and the badge reflects what students actually experience.
Extend the due date to reopen, or select Closed to make it permanent.

**Why can't my students see the rubric while they work?**
The rubric is part of grading, so it appears when the Feedback column opens it (Live, Per
student once finalized, or Released). If you want
students to see criteria up front, put them in the assignment description, or use live
feedback mode.

**I published — why can't students submit?**
Check that **Allow student upload** is on (Settings → Submission). Published makes the
assignment open; that setting says whether students upload their own work at all (some
courses upload on students' behalf, e.g. scanned exams).

**Does un-publishing delete anything?**
No. Moving backwards (Published → Preview, or anything → Draft) only changes what
students can see and do. Submissions and grades are kept.

**What do my scripts get from the API?**
Scripts read and write two fields: `state`
(`draft`/`visible`/`preview`/`published`/`closed`/`archived`) for the work axis, and
`feedbackStatus` (`hidden`/`live`/`per_student`/`released`) for the feedback axis —
plus a read-only `effectiveState` that includes the automatic close, and the
schedulers `publishAt` / `releaseFeedbackAt`. The old boolean fields
(`isVisible`, `isReleased`, `feedbackReleased`, `liveFeedbackMode`) are still returned
for compatibility, read-only and derived from the two status fields — writing them
returns an error telling you which field to set instead.

**How do I tell students their feedback is ready?**
Feedback notifications are per submission: when a grader finalizes, codePost offers to
email that student (if the course has feedback notifications enabled), and staff can
send the same email from a submission at any time once its feedback is visible. The
whole-assignment **Notify students** email in the Status badge's popover announces
*publication*, not feedback.
